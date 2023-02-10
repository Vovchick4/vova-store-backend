import { Model, DataTypes } from "sequelize"
import { sequelize } from "../../index"

class Item extends Model {
    name!: string
    desc!: string
    img!: string
    price!: number
}

Item.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    desc: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    img: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    }
}, { sequelize })

Item.sync({}).then(() => {
}).catch(err => console.log(err))

export default Item
