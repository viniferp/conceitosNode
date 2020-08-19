const express = require( "express" );
const cors = require( "cors" );
const { uuid } = require( "uuidv4" );

// const { v4: uuid } = require('uuid');

const app = express();

app.use( express.json() );
app.use( cors() );

const repositories = [];

app.get( "/repositories", ( request, response ) => {
  return response.status( 200 ).json( repositories );
});

app.post("/repositories", ( request, response ) => {
  const { title, url, techs } = request.body;
  const repository = {
    'id' : uuid(),
    'title' : title,
    'url' : url,
    'techs' : techs,
    'likes' : 0
  }
repositories.push( repository );
return response.status( 200).json( { repository } );
} );

app.put( "/repositories/:id", ( request, response ) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex( repository => repository.id == id );

  if( repositoryIndex < 0 ){
    return response.status( 400 ).json( { 'error' :  'Repository index Not Found' } );
  }
  repositories[ repositoryIndex ] = {
    'title' : title,
    'url' : url,
    'techs' : techs,
    'likes' : repositories[ repositoryIndex ].likes
  }
  return response.status( 200 ).json( repositories[ repositoryIndex ] );
});

app.delete( "/repositories/:id", ( request, response ) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  if( repositoryIndex < 0 ){
    return response.status( 400 ).json( { 'error' : 'Repository index Not Found' } );
  };

  repositories.splice( repositoryIndex, 1 );
  return response.status( 204 ).send();
});

app.post( "/repositories/:id/like", ( request, response ) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex( repository => repository.id === id );
  if( repositoryIndex < 0 ){
    return response.status( 400 ).json( {'error' : 'Repository index Not Found' } );
  }
  const like  = parseInt( repositories[ repositoryIndex ].likes ) + 1;

  const { title, url, techs} = repositories[ repositoryIndex ];
  repositories[ repositoryIndex ] = {
    'id' : id,
    'title' : title,
    'url' : url,
    'techs' : techs,
    'likes': like
  };
  const repo = repositories[ repositoryIndex ];
  return response.status( 200 ).json( repo );
});

module.exports = app;
