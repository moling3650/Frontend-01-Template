// publish-tool 浏览器获取code
// https://github.com/login/oauth/authorize?client_id=Iv1.e27c806365fcbd36&redirect_uri=http%3A%2F%2Flocalhost.com&state=zyx987


// publish-server 获取token
{
  let code = '132c9a9006bbe037297f';
  let state = 'zyx987';
  let client_secret = '37953e2da1c508b19f2be3d9eb8725b3fa362214';
  let client_id = 'Iv1.e27c806365fcbd36';
  let redirect_uri = encodeURIComponent('http://localhost.com');

  let params = `code=${code}&state=${state}&client_secret=${client_secret}&client_id=${client_id}&redirect_uri=${redirect_uri}`;

  let xhr = new XMLHttpRequest();

  xhr.open('POST', `https://github.com/login/oauth/access_token?${params}`, true);
  xhr.send(null);

  xhr.addEventListener('readystatechange', function (event) {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText);
    }
  });
}

// publish-tool/publish-server 调用接口 
{
  let xhr = new XMLHttpRequest();

  xhr.open('GET', `https://api.github.com/user`, true);
  xhr.setRequestHeader('Authorization', `token e8826d11ac7e4bb698ee2ff70182e7cde506eaa8`);
  xhr.send(null);

  xhr.addEventListener('readystatechange', function (event) {
    if (xhr.readyState === 4) {
      console.log(xhr.responseText);
    }
  });
}