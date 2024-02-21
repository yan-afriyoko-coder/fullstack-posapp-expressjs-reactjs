import { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from "../../features/ProductSlice.js";
import { toast } from "react-toastify";
import CardProduct from "./CardProduct.jsx";
import { FaSearch } from "react-icons/fa";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import { addToCart, updateCart } from "../../features/CartSlice.js";
import secureLocalStorage from "react-secure-storage";

const ListProduct = () => {
  const [query, setQuery] = useState("");
  const [keyword, setKeyword] = useState("");
  const products = useSelector((state) => state.product.data);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProduct(keyword));
  }, [dispatch, keyword]);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
      });
    }
  }, [error]);

  const serchData = (e) => {
    e.preventDefault();
    setKeyword(query);
  };

  const setCart = async (product) => {
    const user = secureLocalStorage.getItem("user");
    let headersList = {
      Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
      "Content-Type": "application/json",
    };

    let reqOptions = {
      url: `/api/carts/product/${product.id}/${user.id}`,
      method: "GET",
      headers: headersList,
    };
    const response = await axiosInstance.request(reqOptions);
    if (response.data.result) {
      // lakukan update cart
      const orderItem = response.data.result;
      orderItem.qty = parseInt(orderItem.qty) + 1;
      orderItem.totalPrice =
        parseInt(orderItem.price) * parseInt(orderItem.qty);
      dispatch(updateCart(orderItem));
    } else {
      // lakukan insert cart
      const orderItem = {
        price: product.price,
        productName: product.productName,
        qty: 1,
        totalPrice: product.price,
        note: "",
        productId: product.id,
        userId: user.id,
      };
      dispatch(addToCart(orderItem));
    }
  };

  return (
    <>
      <Col md={8} lg={7}>
        <div className="bg-body-tertiary rounded p-3">
          <Row>
            <Col md={4}>
              <h4>Product Detail</h4>
            </Col>
            <Col md={8}>
              <form onSubmit={serchData}>
                <InputGroup className="mb-3">
                  <Form.Control
                    placeholder="Search ..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button type="submit" variant="primary">
                    <FaSearch /> Search
                  </Button>
                </InputGroup>
              </form>
            </Col>
          </Row>
          {loading ? "Loading..." : ""}
          <Row>
            {products.map((product) => (
              <CardProduct
                key={product.id}
                product={product}
                setCart={setCart}
              />
            ))}
          </Row>
        </div>
      </Col>
    </>
  );
};

export default ListProduct;
