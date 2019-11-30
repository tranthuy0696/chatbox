const User = require('./model')
exports.findByUsernameWithPassword = (username) => {
    return new Promise((resolve, reject) => {
      User.findOne({username: username, enabled: true})
        .exec((err, result) => {
          if (err) {
            reject(err)
          } else if (!result) {
            reject('Not found')
          } else {
            resolve(result)
          }
        })
    })
  }

exports.addUser = (data) => {
    if (!data || !data.username || !data.password) {
        return Promise.reject('Username and password are required!')
    }
    let user = new User(data)
    return user.save().then((rs) => {
      rs = rs.toObject()
      delete rs.password
    return Promise.resolve(rs)
    })
}
