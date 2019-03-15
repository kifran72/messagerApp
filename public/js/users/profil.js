

app.controller('profil', function($scope, $http) {
  $http.get('/profil', (req, res) => {
    res.sendFile(__dirname + '/img');
  });

  // It's very crucial that the file name matches the name attribute in your html
  $http.post('/getFile', upload.single('file-to-upload'), (req, res) => {
    res.redirect('/');
  });
});

