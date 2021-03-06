/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react'),
  Router = require('react-router'),
  RouteHandler = Router.RouteHandler,

  mui = require('material-ui'),
  RaisedButton = mui.RaisedButton,
  FlatButton = mui.FlatButton,
  TextField = mui.TextField,
  Paper = mui.Paper,

  SvgAnimatedBackground = require('../svganimatedbg.jsx');

var Main = React.createClass({
  
  mixins : [Router.Navigation],

  getInitialState: function() {
    return {
      isLogged : false,
      data : []
    };
  },

  onSubmitHandler: function (e) {
    var self = this;
    e.stopPropagation();
    e.preventDefault();
    var action = e.currentTarget.action.replace(window.location.host, '').replace(window.location.protocol, '').replace('//', '');
    var req = ajax({
          url : this.props.apiUrl + action,
          form: e.currentTarget,
          credentials: true,
          type: 'json',
          success : function (res, req) {
            self.setState({isLogged: true});
            self.setState({data : req.responseTxt})
            self.transitionTo('/me/feed');
          },
          error : function (e) {
            self.isLogged = false;
          }
        })
    req.send();
  },

  onGoogleClick: function () {
    return false;
  },

  onFbClick: function () {
    return false;
  },

  render: function() {
    if (!this.state.isLogged) {
      return (
      <div id="home">
        <SvgAnimatedBackground/>
        <svg id="title" x="0px" y="0px"
         width="100%" height="300px" viewBox="0 0 1920 320"
         space="preserve" dangerouslySetInnerHTML={{__html:
          '<defs>\
            <path id="titleTextPath" d="M620,480 A250,250, 0 0,1 1260,480"/>\
          </defs>\
          <g >\
             <text x="190" y="0" id="title"\
              style="font-family: Chango;\
                       font-size  : 5.05em;\
                       stroke     : #996300;\
                       fill       : #eee;\
                       stroke-width: 4;\
                      ">\
              <textPath xlink:href="#titleTextPath" filter="url(#dropshadow)" >\
                    HAMSTERACE\
              </textPath>\
            </text>\
          </g>'
          }}>
        </svg>
        <Paper zDepth={2} circle={true} id="img-header">
          <img src="/images/hamster.png" width="128" />
        </Paper>
        <div id="form-wrapper">
          <form action="/login" method="post" onSubmit={this.onSubmitHandler}>
           <TextField
            hintText="Identifiants" name="email"/>
            <TextField
            hintText="Password" name="password" type="password"/>
            <div className="form-group">
              <FlatButton label="valider" />
              <FlatButton label="s'Enregister" />
            </div>
          </form>
          <hr/>
          <div className="form-group">
            <p className="mui-font-style-body-2">Se connecter avec : </p>
            <FlatButton label="Google+" primary={true} onClick={this.onGoogleClick}/>
            <FlatButton label="Facebook" secondary={true} onClick={this.onFbClick}/>
            </div>
        </div>
      </div>
      );
    }
    return (
      <RouteHandler apiUrl={this.props.apiUrl}/>
    )
  }  
});

module.exports = Main;