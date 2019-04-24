import React, { Component } from 'react'
import api from '../../services/api'

import './styles.css'
import logo from '../../assets/logo.svg'

export default class Main extends Component {
  state = {
    newBox: ''
  }

  handleInputChange = event => {
    this.setState({ newBox: event.target.value })
  }

  handleSubmit = async event => {
    event.preventDefault()

    const response = await api.post('boxes', {
      title: this.state.newBox
    })

    this.props.history.push(`/box/${response.data._id}`)
  }

  render () {
    return (
      <div id='main-container'>
        <form onSubmit={this.handleSubmit}>
          <div className='logo'>
            <img src={logo} alt='Rocketseat' className='logo-image' />
            <p className='logo-type'>RocketBox</p>
          </div>
          <input
            placeholder='Create new box'
            value={this.state.newBox}
            onChange={this.handleInputChange}
          />
          <button type='submit'>Create</button>
        </form>
      </div>
    )
  }
}
