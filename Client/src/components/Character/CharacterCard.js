import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Panel, Button } from "react-bootstrap";

import { getClassByName } from "../../utils/getClassByName";

import {
  selectCharacter,
  unselectCharacter
} from "../../actions/characterActions";

import {
  selectMultiplayerCharacter,
  unselectMultiplayerCharacter
} from "../../actions/multiplayerActions";

import * as stats from "../../config/stats.json";

class CharacterCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: false,
    };
  }

  handleClick = () => {
    const { selection } = this.state;
    const {
      id,
      selectCharacter,
      selectMultiplayerCharacter,
      unselectCharacter,
      unselectMultiplayerCharacter,
      multiplayer,
      socket } = this.props;

    if (multiplayer) {
      if (selection) {
        unselectMultiplayerCharacter(id, socket);
      } else {
        selectMultiplayerCharacter(id, socket);
      }
    }

    if (selection) {
      unselectCharacter(id);
    } else {
      selectCharacter(id);
    }

    this.setState(prevState => ({
      selection: !prevState.selection
    }));
  };

  render() {
    const classType = getClassByName(this.props.classType);
    const { selection } = this.state;
    const { section, selections, id, icon, name, life, defense, attack, speed, selectable } = this.props;
    let button;
    if (selectable) {
      if (selection) {
        button = (
          <Button onClick={this.handleClick} bsStyle="danger" block>
            Unselect
          </Button>
        );
      } else if (section === 4 && selections.length > 0) {
        button = (
          <Button onClick={this.handleClick} bsStyle="primary" block disabled>
            Select
          </Button>
        );
      } else {
        button = (
          <Button onClick={this.handleClick} bsStyle="primary" block>
            Select
          </Button>
        );
      }
    }

    return (
      <Panel id={id} height="30px">
        <Panel.Heading>
          <Panel.Title componentClass="h3">
            <i className={icon} /> <span style={{ color: (classType.color ? classType.color : "") }}>{name ? name : "Choose a Name"}</span><p className="pull-right"><i className={classType.icon ? classType.icon : ""} /></p>
          </Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <p>
            <i className={stats.life} /> {life}
          </p>
          <p>
            <i className={stats.defense} /> {defense}
          </p>
          <p>
            <i className={stats.attack} /> {attack}
          </p>
          <p>
            <i className={stats.speed} /> {speed}
          </p>
          {button}
        </Panel.Body>
      </Panel>
    );
  }
}

CharacterCard.defaultProps = {
  selectable: true,
  classType: "",
  multiplayer: false
};

CharacterCard.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  classType: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  life: PropTypes.number.isRequired,
  defense: PropTypes.number.isRequired,
  attack: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
  selectCharacter: PropTypes.func.isRequired,
  unselectCharacter: PropTypes.func.isRequired,
  selectable: PropTypes.bool,
  multiplayer: PropTypes.bool
};

const mapStateToProps = state => ({
  selections: state.character.selected,
  section: state.section.section,
  socket: state.multiplayer.socket
});

export default connect(mapStateToProps, { selectCharacter, unselectCharacter, selectMultiplayerCharacter, unselectMultiplayerCharacter })(CharacterCard);