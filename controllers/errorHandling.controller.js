exports.invalidEndpoint = (req, res) => {
  res.status(404).send({ msg: "404 Page Not Found!" });
};

exports.PSQLerrors = (err, req, res, next) => {
  if (
    err.code === "22P02" &&
    typeof req.body.votes !== "number" &&
    req.route.methods.patch === true
  ) {
    res
      .status(400)
      .send({ msg: "Invalid Input, Type Of Votes Should Be A Number" });
  } else if (err.code === "22P02") res.status(400).send({ msg: "Invalid ID" });
  next(err);
};

exports.customError = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  next(err);
};

exports.serverError = (err, req, res, next) => {
  res.status(500).send({ msg: "500 Server Error" });
};
