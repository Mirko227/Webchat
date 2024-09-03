const users = []

function joinChat(id,username){

    const user = { id , username };
    users.push(user);
    return user;

  }

  function getCurrentUser(id){
    return users.find(user => user.id === id );
  }

  function userLeave(id){
    const index = users.findIndex(user => user.id === id);

    if(index !== -1){
      return users.splice(index, 1)[0];
    }
  }

  function randomColor() {

    var colors = [

      '#00E000', '#0000ff','#FFADD9',
      '#ff3333', '#EECD59','#7332C3'
      
    ];   
    
    var random_color = colors[Math.floor(
            Math.random() * colors.length)];   
            return random_color;
  }

function getUsers()
{
  return users.map(user => user.username);
}

module.exports = {joinChat,getCurrentUser,userLeave,randomColor,getUsers}