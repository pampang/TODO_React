import React from 'react';

export default class TodoBox extends React.Component{
  render() {
    return (
    	// 从server传入的数据也可以通过this.props.***来获取
    	<div className="todoBox">
    		<h1>Todos</h1>
    		<TodoList data={this.props.data} />
    		<TodoForm />
    	</div>
    );
  }
}

class TodoList extends React.Component {
	// Write code here
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.data,
			titleValue: '',
			detailValue: ''
		};
		// 绑定this
		this.changeTitle = this.changeTitle.bind(this);
		this.changeDetail = this.changeDetail.bind(this);
		this.addTodo = this.addTodo.bind(this);
		this.deleteTodo = this.deleteTodo.bind(this);
	}

	changeTitle(e) {
		this.setState({titleValue: e.target.value});
	}

	changeDetail(e) {
		this.setState({detailValue: e.target.value});
	}

	addTodo() {
		var newData = {
				title: this.state.titleValue,
				detail: this.state.detailValue
			},
			data = this.state.data;

		data.push(newData);

		this.setState({data: data});
	}

	deleteTodo(title) {
		let newData = this.state.data.filter(function (todo) {
			return todo.title !== title;
		});
		this.setState({data: newData});
	}

	render() {
		let self = this;
		let todo = this.state.data.map(function (obj) {
			return <Todo title={obj.title} key={obj.title} onDelete={self.deleteTodo}>{obj.detail}</Todo>
		});
		return (
			<div className="todoList">
				<div>
					Title: <input type="text" value={this.state.titleValue} onChange={this.changeTitle} />
					Detail: <input type="text" value={this.state.detailValue} onChange={this.changeDetail} />
					<button onClick={this.addTodo}>Add</button>
				</div>
				<table style={{boder: "2px solid black"}}>
					<tbody>
						{todo}
					</tbody>
				</table>
			</div>
		);
	}
}

class Todo extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
        	checked: false,
        	trStyle: style.notCheckedTodo
       	};
       	this.handleChange = this.handleChange.bind(this);
       	this._onDelete = this._onDelete.bind(this);
    }

    // 无法在这里函数里面找到this。为什么?
	handleChange(e) {
		var trStyle;
		if (e.target.checked) {
			trStyle = style.checkedTodo;
		} else {
			trStyle = style.notCheckedTodo;
		}
		this.setState({
			checked: e.target.checked,
			trStyle: trStyle
		});
	}

	_onDelete() {
		this.props.onDelete(this.props.title);
	}

	render() {
		return (
			<tr style={this.state.trStyle}>
				<td style={style.tableContent}>
					<button onClick={this._onDelete}>X</button>
				</td>
				<td style={style.tableContent}>
					<input type="checkbox" checked={this.state.checked} onChange={this.handleChange.bind(this)} />
				</td>
				<td style={style.tableContent}>{this.props.title}</td>
				<td style={style.tableContent}>{this.props.children}</td>
			</tr>
		)
	}
}

Todo.propTypes = {
    title: React.PropTypes.string.isRequired
};

class TodoForm extends React.Component {
	// Write code here
	render() {
		return (
			<div className="todoForm">
				I am a TodoForm.
			</div>
		)
	}
}

let style = {
	checkedTodo: {
		textDecoration: 'line-through'
	},
	notCheckedTodo: {
		textDecoration: 'none'
	},
	tableContent: {
		border: "1px solid black"
	}
}