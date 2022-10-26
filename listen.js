const app = require(`./app
`);
const PORT = process.env.PORT;

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Listening on ${PORT}...`);
});
