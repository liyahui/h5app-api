import config from '../config/qiniu'

export default (sequelize, DataTypes) => {
	return sequelize.define('Resource', {
		id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING
    },
    key: {
      type: DataTypes.STRING(28)
    },
    props: {
      type: DataTypes.STRING,
      get() {
        const val = this.getDataValue('props')
        return val ? JSON.parse(val) : {}
      },
      set(val) {
        this.setDataValue('props', JSON.stringify(val))
      }
    },
	}, {
    getterMethods: {
      url() {
        return config.origin + '/' + this.getDataValue('key')
      }
    }
  })
}