import moment from 'moment'

export default {
  username: 'liyahui',
  password: 'huihong1224',
  database: 'h5app',
  host: 'liyahui.cn',
  dialect: 'mysql',

  define: {
    underscored: true,
    underscoredAll: true,
    timestamps: true,
    paranoid: true,
    getterMethods: {
      created_at() {
        const date = this.getDataValue('created_at')
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      },
      updated_at() {
        const date = this.getDataValue('updated_at')
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  
  logging() {

  }
}
