import React, { Component } from "react";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text
} from "native-base";
export default class Home extends Component {
  componentWillMount() {
    console.log(this.props.user.displayName);
  }
  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>{this.props.user.displayName}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Text>Home Page</Text>
        </Content>
      </Container>
    );
  }
}
