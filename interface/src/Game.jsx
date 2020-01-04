import React from "react";
import axios from "axios";
import "./Game.css";

class Game extends React.Component {
	state = {
		results: "",
		player: 0,
		computer: 0,
		choices: []
	};

	componentDidMount() {
		axios.get(`/choices`).then(res => {
			const choices = res.data;
			this.setState({ choices });
		});
	}

	formattedResults() {
		if (this.state.results == null || this.state.results === "") {
			return "";
		}
		return (
			"You " + this.sentenceCase(this.state.results) + "!"
		);
	}

	/**
	 * returns the sentence case name of the given choice id
	 * @param {number} id 
	 */
	getChoiceName(id) {
		return this.sentenceCase(this.state.choices[id - 1].name);
	}

	getComputerString() {
		if (this.state.computer === 0) {
			return "";
		}
		return "Computer: " + this.getChoiceName(this.state.computer);
	}

	getPlayerString() {
		if (this.state.player === 0) {
			return "";
		}
		return "Player: " + this.getChoiceName(this.state.player);
	}

	/**
	 * Plays the given choice id against the server 
	 * @param {number} choice the integer choice of the player to send to the server
	 * @param {*} event the on-click event from calling this function 
	 */
	play(choice, event) {
		axios.post(`/play`, { player: choice }).then(res => {
			const outcome = res.data;
			this.setState({ ...outcome });
		});
	}

	/**
	 * Gets a random choice from the server and plays it
	 */
	playRandom() {
		axios.get(`/choice`).then(res => {
			const choice = res.data["id"];
			this.play(choice);
		});
	}

	sentenceCase(str) {
		return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
	}

	render() {
		return (
			<div>
				<div className="choices">
					<ul>
						{this.state.choices.map(post => (
							<li className="btn-choice" key={post.id}>
								<button onClick={this.play.bind(this, post.id)}>
									{this.getChoiceName(post.id)}
								</button>
							</li>
						))}
						<li className="btn-choice">
							<button onClick={this.playRandom.bind(this)}>
								Pick for me
							</button>
						</li>
					</ul>
				</div>
				<div>
					<h2>{this.getPlayerString()}</h2>
					<h2>{this.getComputerString()}</h2>
				</div>
				<div className="results">
					<h2>{this.formattedResults()}</h2>
				</div>
			</div>
		);
	}
}

export default Game;
