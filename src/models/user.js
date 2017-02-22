export default (sequelize, DataTypes) => {
	return sequelize.define('User', {
		openid: DataTypes.STRING,
		nickname: DataTypes.STRING
	}, {
		tableName: 'ppmoney',
		timestamps: false
	})
}