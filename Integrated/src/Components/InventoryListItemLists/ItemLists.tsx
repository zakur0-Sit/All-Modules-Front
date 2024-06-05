import React from 'react'
import Product, { ProductProps , ItemList} from '../InventoryListProduct/Product';
import '../InventoryListProduct/Product.css';

interface ContentProps{
  products: ProductProps;
  setUpdatedQuantity: React.Dispatch<React.SetStateAction<number>>;
  handleIncreaseQuantity: (name : string) => void;
  handleDecreaseQuantity: (name : string) => void;
  handleChangeQuantity: (name : string, quantity: number) => void;
  handleSubmit: (e : React.FormEvent<HTMLFormElement>) => void;
  handleSubmitUpdate: (e: React.FormEvent<HTMLFormElement>, name: string) => void;
  handleDelete: (name : string) => void;
  setNewId: React.Dispatch<React.SetStateAction<number>>;
  setNewProduct: React.Dispatch<React.SetStateAction<string>>;
  setNewQuantity: React.Dispatch<React.SetStateAction<number>>;
}

const ItemLists: React.FC<ContentProps> = ({
  products, 
  setUpdatedQuantity, 
  handleChangeQuantity, 
  handleIncreaseQuantity, 
  handleDecreaseQuantity, 
  handleSubmit, 
  handleSubmitUpdate, 
  handleDelete,
  setNewId,
  setNewProduct, 
  setNewQuantity
}) => {

  const {itemList} = products;

  return (
    <div className="productListInventory">
      {itemList?.map((item, index) => (
        <div className="productContainerInventory" key={index}>
          <Product
            item={item.item}
            setUpdatedQuantity={setUpdatedQuantity}
            quantity={item.quantity}
            averageConsumption={item.averageConsumption}
            handleChangeQuantity={handleChangeQuantity}
            handleIncreaseQuantity={handleIncreaseQuantity}
            handleDecreaseQuantity={handleDecreaseQuantity}
            handleDelete={handleDelete}
            handleSubmitUpdate={handleSubmitUpdate}
            id={undefined}
          />
        </div>
      ))}
      <div className="productContainerInventory">
        <Product
          item={{
            "name": "",
            "eatable": false
          }}
          quantity={{
            "value": 0,
            "type": "Amount"
          }} 
          averageConsumption={0}
          handleChangeQuantity={handleChangeQuantity}
          handleIncreaseQuantity={handleIncreaseQuantity}
          handleDecreaseQuantity={handleDecreaseQuantity}
          handleSubmit={handleSubmit}
          handleSubmitUpdate={handleSubmitUpdate}
          handleDelete={handleDelete}
          setNewId={setNewId}
          setNewProduct={setNewProduct}
          setNewQuantity={setNewQuantity}
          setUpdatedQuantity={setUpdatedQuantity}
          id={undefined}
        />
      </div>
    </div>
  )
}

export default ItemLists