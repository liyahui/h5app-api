import md5 from 'md5'

export default (sequelize, DataTypes) => {
	return sequelize.define('User', {
		id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(20),
    },
    password: {
      type: DataTypes.STRING(32),
      set(val) {
        this.setDataValue('password', md5(val))
      }
    }
	})
}