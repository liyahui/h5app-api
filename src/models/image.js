import config from '../config/qiniu'

export default (sequelize, DataTypes) => {
	return sequelize.define('Image', {
		id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
    },
    key: {
      type: DataTypes.STRING(28)
    },
    width: {
      type: DataTypes.INTEGER
    },
    height: {
      type: DataTypes.INTEGER
    }
	}, {
    getterMethods: {
      url() {
        return config.origin + '/' + this.getDataValue('key')
      }
    }
  })
}