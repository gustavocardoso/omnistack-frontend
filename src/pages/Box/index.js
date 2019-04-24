import React, { Component } from 'react'
import { MdInsertDriveFile } from 'react-icons/md'
import api from '../../services/api'
import { distanceInWords } from 'date-fns'
import en from 'date-fns/locale/en'
import Dropzone from 'react-dropzone'
import socket from 'socket.io-client'

import logo from '../../assets/logo.svg'
import styles from './styles.css'

export default class Box extends Component {
  state = {
    box: {}
  }

  async componentDidMount () {
    this.subscribeToNewFiles()
    const box = this.props.match.params.id
    const response = await api.get(`/boxes/${box}`)

    this.setState({ box: response.data })
  }

  subscribeToNewFiles = () => {
    const box = this.props.match.params.id
    const io = socket('https://gus-omnistack-backend.herokuapp.com')

    io.emit('connectRoom', box)

    io.on('file', data => {
      this.setState({
        box: { ...this.state.box, files: [data, ...this.state.box.files] }
      })
    })
  }

  handleUpload = files => {
    files.forEach(file => {
      const box = this.props.match.params.id
      const data = new FormData()

      data.append('file', file)

      api.post(`/boxes/${box}/files`, data)
    })
  }

  render () {
    return (
      <div id='box-container'>
        <header className='logo'>
          <img src={logo} alt='Rocketseat' className='logo-image' />
          <p className='logo-type'>RocketBox</p>
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps }) => (
            <div className='upload' {...getRootProps()}>
              <input {...getInputProps()} />

              <p>Drag and drop files or click here!</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file._id}>
                <a
                  className='fileinfo'
                  href={file.url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <MdInsertDriveFile size={24} color='#a4cfff' />
                  <strong>{file.title}</strong>
                </a>

                <span>
                  {distanceInWords(file.createdAt, new Date(), {
                    locale: en
                  })}{' '}
                  ago
                </span>
              </li>
            ))}
        </ul>
      </div>
    )
  }
}
