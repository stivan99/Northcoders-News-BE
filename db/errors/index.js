exports.psqlErrorHandler = (err, request, response, next) => {
  // console.log(err);
  if (["22P02"].includes(err.code)) {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.customErrorHandler = (err, request, response, next) => {
  if (err.status && err.msg) {
    response.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.serverErrorHandler = (err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: "Internal Server Error" });
};
