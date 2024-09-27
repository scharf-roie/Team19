import React from 'react'
import { Button, Form, Grid, Header, Image, Message, Segment } from 'semantic-ui-react'

const LoginForm = () => (
  <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
    <Grid.Column style={{ maxWidth: 450 }}>
      <Header as='h2' color='teal' textAlign='center'>
      <Image size='extra-large' src='logo512.png' style={{ marginRight: '0.5em', marginTop: '-0.5em' }} /> Log-in to your account
      </Header>
      <Form size='large'>
        <Segment stacked>
          <Form.Input fluid icon='user' iconPosition='left' placeholder='E-mail address' />
          <Form.Input
            fluid
            icon='lock'
            iconPosition='left'
            placeholder='Password'
            type='password'
          />

          <div class="g-signin2" data-onsuccess="onSignIn" style={{marginBottom: '20px'}}></div>
          <Button color='teal' fluid size='large'>
            Login
          </Button>
          <a href="jank.html">Sus</a>
        </Segment>
      </Form>
      <Message>
        New to us? <a href='register'>Register</a>
      </Message>
    </Grid.Column>
  </Grid>
)

export default LoginForm