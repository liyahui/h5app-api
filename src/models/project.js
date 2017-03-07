import config from '../config/qiniu'

export default (sequelize, DataTypes) => {
	return sequelize.define('Project', {
		id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING
    },
    desc: {
      type: DataTypes.STRING
    },
    icon: {
      type: DataTypes.STRING
    },
    cover: {
      type: DataTypes.STRING,
      get() {
        const cover = this.getDataValue('cover')
        return cover ? config.origin + '/' + this.getDataValue('cover') : null
      },
      set(val) {
        val = val ? val.replace(config.origin + '/', '') : val
        this.setDataValue('cover', val)
      }
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
    pages: {
      type: DataTypes.TEXT,
      get() {
        const val = this.getDataValue('pages')
        return val ? JSON.parse(val) : []
      },
      set(val) {
        this.setDataValue('pages', JSON.stringify(val))
      }
    }
	})
}