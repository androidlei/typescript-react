/// <reference path="./components/interfaces.d.ts"/>

declare var Router : any;
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { TodoModel } from './components/todoModel';
import { TodoFooter } from './components/footer';
import { TodoItem } from './components/todoItem';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS, ENTER_KEY } from './utils/constants';

class TodoApp extends React.Component<IAppProps, IAppState>{
    public state: IAppState;
    constructor(props: IAppProps) {
        super(props);
        this.state = {
            nowShowing: ALL_TODOS,
            editing: null
        };
    }

    componentDidMount(): void {
        var setState = this.setState;
        var router = Router({
            '/': setState.bind(this, {nowShowing: ALL_TODOS}),
            '/active': setState.bind(this, {nowShowing: ACTIVE_TODOS}),
            '/completed': setState.bind(this, {nowShowing: COMPLETED_TODOS})
        });
        router.init('/');
    }

    public handleNewTodoKeyDown(event: React.KeyboardEvent) {
        if (event.keyCode !== ENTER_KEY) {
            return;
        }
        event.preventDefault();

        // @ts-ignore
        var val = (ReactDOM.findDOMNode(this.refs['newField']) as HTMLInputElement).value.trim();

        if (val) {
            this.props.model.addTodo(val);
            // @ts-ignore
            (ReactDOM.findDOMNode(this.refs['newField']) as HTMLInputElement).value = '';
        }
    }

    public toggleAll(event: React.FormEvent) {
        var target: any = event.target;
        var checked = target.checked;
        this.props.model.toggleAll(checked);
    }

    public toggle(todoToToggle: ITodo) {
        this.props.model.toggle(todoToToggle);
    }

    public destroy(todo: ITodo) {
        this.props.model.destroy(todo);
    }

    public edit(todo: ITodo) {
        this.setState({editing: todo.id});
    }

    public save(todoToSave: ITodo, text: string) {
        this.props.model.save(todoToSave, text);
        this.setState({editing: null});
    }

    public cancel() {
        this.setState({editing: null});
    }

    public clearCompleted() {
        this.props.model.clearCompleted();
    }

    public render(): React.ReactNode {
        var footer;
        var main;
        const todos = this.props.model.todos;

        var shownTodos = todos.filter((todo) => {
           switch (this.state.nowShowing) {
               case ACTIVE_TODOS:
                   return !todo.completed;
               case COMPLETED_TODOS:
                   return todo.completed;
               default:
                   return true;
           }
        });

        var todoItems = shownTodos.map((todo) => {
           return (
               <TodoItem
                   key={todo.id}
                   todo={todo}
                   onSave={this.save.bind(this, todo)}
                   onDestroy={this.destroy.bind(this, todo)}
                   onEdit={this.edit.bind(this, todo)}
                   onCancel={e => this.cancel()}
                   editing={this.state.editing === todo.id}
                   onToggle={this.toggle.bind(this, todo)}/>
           );
        });

        var activeTodoCount = todos.reduce(function (accum, todo) {
           return todo.completed ? accum : accum + 1;
        }, 0);

        var completedCount = todos.length - activeTodoCount;

        if (activeTodoCount || completedCount) {
            footer = <TodoFooter
                completedCount={completedCount}
                onClearCompleted={(e: any) => this.clearCompleted()}
                nowShowing={this.state.nowShowing}
                count={activeTodoCount}/>
        }

        if (todos.length) {
            main = (
              <section className="main">
                  <input
                    id="toggle-all"
                    className="toggle-all"
                    type="checkbox"
                    onChange={e => this.toggleAll(e)}
                    checked={activeTodoCount === 0}
                  />
                  <label
                    htmlFor="toggle-all"
                  >
                      Mark all as complete
                  </label>
                  <ul className="todo-list">
                      {todoItems}
                  </ul>
              </section>
            );
        }

        return (
            <div>
                <header className="header">
                    <h1>todos</h1>
                    <input
                        ref="newField"
                        className="new-todo"
                        placeholder="What needs to be done?"
                        onKeyDown={e => this.handleNewTodoKeyDown(e)}
                        autoFocus={true}
                    />
                </header>
                {main}
                {footer}
            </div>
        );
    }
}

var model = new TodoModel('react-todos');

function render() {
    ReactDOM.render(
        <TodoApp model={model}/>,
        document.getElementById('root')
    );
}

model.subscribe(render);
render();
