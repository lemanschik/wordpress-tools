const server = await import('node:net').then((net) => {
  const server = net.createServer(async (socket) => {
    socket.on('data',(data) => {
        const [requestHeader, ...bodyContent] = data.toString().split('\r\n\r\n');

        const [firstLine, ...otherLines] = requestHeader.split('\n');
        const [method, path, httpVersion] = firstLine.trim().split(' ');
        const headers = Object.fromEntries(otherLines.filter(_=>_)
            .map(line=>line.split(':').map(part=>part.trim()))
            .map(([name, ...rest]) => [name, rest.join(' ')]));

        let body = method.toLowerCase() === "post" ? 
          await Promise.resolve(bodyContent).then(JSON.parse).catch(() => bodyContent) 
          : bodyContent;
        
        const request = {
            method, 
            path,
            httpVersion,
            headers,
            body
        };
        console.log(request)
        socket.write(`HTTP/1.1 200 OK\n\nhallo ${request.body.name}`)
        socket.end((err)=>{console.log(err)})
    });
  });

  server.listen(80)
  return server;
});
