import random
import json
from json import JSONDecodeError

from flask import Flask, Response, json as flask_json, request
from flask_restful import Api, Resource

app = Flask(__name__)
api = Api(app)

# load choices and winning combinations from 'definitions.json'
with open('definitions.json', 'r') as file:
    definitions_string = file.read()
definitions = json.loads(definitions_string)
choice_list = []
for obj in definitions:
    choice_list.append({'id': obj['id'], 'name': obj['name']})


def random_choice():
    return definitions[random.randint(0, 4)]


def outcome(player_choice, computer_choice):
    """
    The function to determine the winner between two given choices.

    Parameters:
        player_choice (int): The id of the human players choice
        computer_choice (dict): The object containing at least 
            the computer players choice and the list of options 
            which it beats
    
    Returns:
        string: A string showing the outcome of the game (win, lose, tie)
    """
    if player_choice == computer_choice['id']:
        return 'tie'
    elif player_choice in computer_choice['beats']:
        return 'lose'
    else:
        return 'win'


class Choices(Resource):
    def get(self):
        """
        The api endpoint for the list of valid rpsls choices

        Returns:
            Response: an http response containing as data a list of 
                rpsls options for the human player
        """
        return Response(
            flask_json.dumps(choice_list),
            mimetype='application/json'
        )


class Choice(Resource):
    def get(self):
        """
        The api endpoint for a random rpsls choice

        Returns:
            Response: an http response containing as data the id and
                name of the random choice
        """
        output = random_choice()
        return Response(
            flask_json.dumps({'id': output['id'], 'name': output['name']}),
            mimetype='application/json'
        )


class Play(Resource):
    def post(self):
        """
        The api endpoint for playing rpsls against the random computer

        Returns:
            Response: an http response containing as data the results
                of the game as a string, the players choice id, and the
                computers choice id
        """
        try:
            player_choice = json.loads(request.data)['player']
        except JSONDecodeError:
            return Response(status=400)

        computer_choice = random_choice()
        result_string = outcome(player_choice, computer_choice)

        return Response(
            flask_json.dumps({'results': result_string, 'player': player_choice, 'computer': computer_choice['id']}),
            mimetype='application/json'
        )


# Setup and launch the server
api.add_resource(Choices, '/choices')
api.add_resource(Choice, '/choice')
api.add_resource(Play, '/play')

app.run(host='0.0.0.0', port='5000')
