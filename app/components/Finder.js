// @flow
import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Grid, Row, Col, Table, Image, Button } from 'react-bootstrap';
import adafruit from './adafruit.svg';

class Finder extends Component {

  static propTypes = {
    find: PropTypes.func.isRequired,
    hosts: PropTypes.array.isRequired
  };


  componentWillMount() {
    const { find } = this.props;
    find();
  }

  renderHosts() {

    const { hosts } = this.props;

    return hosts.map((host, i) => {
      return (
        <tr key={i}>
          <td style={{width: '60px', textAlign:'right'}}>
            <Button bsStyle="success" bsSize="xsmall">connect</Button>
          </td>
          <td>{host.hostname}</td>
          <td>{host.ip}</td>
          <td>{host.mac}</td>
        </tr>
      );
    });

  }

  renderTable() {
    return (
      <Table striped hover>
        <thead>
          <tr>
            <th></th>
            <th>hostname</th>
            <th>ip</th>
            <th>mac</th>
          </tr>
        </thead>
        <tbody>
          {::this.renderHosts()}
        </tbody>
      </Table>
    );
  }

  render() {

    return (
      <Grid>
        <Row>
          <Col xs={4} sm={2} md={4}></Col>
          <Col xs={4} sm={8} md={4}>
            <Image src={adafruit} responsive />
          </Col>
          <Col xs={4} sm={2} md={4}></Col>
        </Row>
        <Row>
          <Col md={12}>{::this.renderTable()}</Col>
        </Row>
      </Grid>
    );

  }
}

export default Finder;
