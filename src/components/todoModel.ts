/// <reference path="./interfaces.d.ts"/>

import { Utils } from '../utils/Utils';

class TodoModel implements ITodoModel{
    public key: any;
    public onChanges: Array<any>;
    public todos: Array<ITodo>;

    constructor(key: any) {
        this.key = key;
        this.todos = Utils.store(key);
        this.onChanges = [];
    }

    addTodo(title: string) {
        this.todos = this.todos.concat(<ITodo>{
           id: Utils.uuid(),
           title: title,
           completed: false
        });
        this.inform();
    }

    clearCompleted() {
        this.todos = this.todos.filter(function (todo) {
            return !todo.completed;
        });
        this.inform();
    }

    destroy(todo: ITodo) {
        this.todos = this.todos.filter(function (candidate) {
            return candidate !== todo;
        });
        this.inform();
    }

    inform() {
        Utils.store(this.key, this.todos);
        this.onChanges.forEach(function (cb) {
            cb();
        })
    }

    save(todoToSave: ITodo, text: string) {
        this.todos = this.todos.map(function (todo) {
            return todo !== todoToSave ? todo : Utils.extend({}, todo, {title: text});
        });
        this.inform();
    }

    subscribe(onChange: any) {
        this.onChanges.push(onChange)
    }

    toggle(todoToToggle: ITodo) {
        this.todos = this.todos.map<ITodo>((todo: ITodo) => {
           return todo !== todoToToggle ?
            todo :
            Utils.extend({}, todo, {completed: !todo.completed});
        });
        this.inform();
    }

    toggleAll(checked: Boolean) {
        this.todos = this.todos.map<ITodo>((todo: ITodo) => {
            return Utils.extend({}, todo, {completed: checked});
        });
        this.inform();
    }

}

export { TodoModel };
