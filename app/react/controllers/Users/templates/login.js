import React, { Component, PropTypes } from 'react'
import Helmet from 'react-helmet'
import '../scss/login.scss'

export default function() {
  return(
    <div className="row login">
      <div className="login-background" />
      <Helmet title="Login" />
      <div className="well col-xs-8 col-xs-offset-2 col-sm-6 col-sm-offset-3 col-md-4 col-md-offset-4">
      {(() => {
        if(this.state.error){
          return <p className="alert alert-warning">Invalid password or username</p>
        }
      })()}
        <form onSubmit={ this.submit }>
          <div className="form-group">
            <label htmlFor="username">Email address</label>
            <input type="text" className="form-control" name="username" id="username" value={ this.state.credentials.username } onChange={ this.user_change }/>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password"  className="form-control" name="password" id="password" value={ this.state.credentials.password } onChange={ this.password_change }/>
          </div>
          <button type="submit" className="btn btn-default btn-primary">Submit</button>
        </form>
      </div>
    </div>
  )
}