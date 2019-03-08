/// <reference path="./interfaces.d.ts"/>

import * as classNames from 'classnames';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ENTER_KEY, ESCAPE_KEY } from '../utils/constants';


class TodoItem extends React.Component<ITodoItemProps, ITodoItemState>{
    public state: ITodoItemState;

    constructor(props: ITodoItemProps) {
        super(props);
        this.state = { editText: this.props.todo.title };
    }

    public handleSubmit(event: React.FormEvent) {
        var val = this.state.editText.trim();
        if (val) {
            this.props.onSave(val);
            this.setState({editText: val});
        } else {
            this.props.onDestroy();
        }
    }

    public handleEdit() {
        this.props.onEdit();
        this.setState({editText: this.props.todo.title});
    }

    public handleKeyDown(event: React.KeyboardEvent) {
        if (event.keyCode === ESCAPE_KEY) {
            this.setState({editText: this.props.todo.title});
            this.props.onCancel(event);
        } else if (event.keyCode === ENTER_KEY) {
            this.handleSubmit(event);
        }
    }

    public handleChange(event: React.FormEvent) {
        var input: any = event.target;
        this.setState({editText: input.value});
    }


    public shouldComponentUpdate(nextProps: ITodoItemProps, nextState: ITodoItemState): boolean {
        return (
            nextProps.todo !== this.props.todo ||
            nextProps.editing !== this.props.editing ||
            nextState.editText !== this.state.editText
        );
    }


    componentDidUpdate(prevProps: ITodoItemProps): void {
        if (!prevProps.editing && this.props.editing) {
            var node = (ReactDOM.findDOMNode(this.refs['editField']) as HTMLInputElement);
            // @ts-ignore
            node.focus();
            // @ts-ignore
            node.setSelectionRange(node.value.length, node.value.length);
        }
    }

    public render(): React.ReactNode {
        return (
            <li className={classNames({
                completed: this.props.todo.completed,
                editing: this.props.editing
            })}>
                <div className="view">
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={this.props.todo.completed}
                        onChange={this.props.onToggle}
                    />
                    <label onDoubleClick={e => this.handleEdit()}>
                        {this.props.todo.title}
                    </label>
                    <button className="destroy" onClick={this.props.onDestroy}/>
                </div>
                <input
                    ref="editField"
                    className="edit"
                    value={this.state.editText}
                    onBlur={e => this.handleSubmit(e)}
                    onChange={e => this.handleChange(e)}
                    onKeyDown={e => this.handleKeyDown(e)}
                />
            </li>
        );
    }
}

export { TodoItem };
