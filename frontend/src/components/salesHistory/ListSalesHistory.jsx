import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
  Table,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import NavbarComponent from "../NavbarComponent.jsx";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../../auth/AxiosConfig.jsx";
import secureLocalStorage from "react-secure-storage";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { IoPrint } from "react-icons/io5";
import { BsArrowReturnLeft } from "react-icons/bs";

const ListSalesHistory = () => {
  const [data, setData] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [tempId, setTempId] = useState(0);
  const limit = 25;
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);

  const loadData = async () => {
    let headersList = {
      Authorization: "Bearer " + secureLocalStorage.getItem("acessToken"),
      "Content-Type": "application/json",
    };
    let reqOptions = {
      url: `/api/orders?search_query=${keyword}&lastId=${lastId}&limit=${limit}`,
      method: "GET",
      headers: headersList,
    };
    try {
      const response = await axiosInstance.request(reqOptions);
      const newData = response.data.result;
      setData([...data, ...newData]);
      setTempId(response.data.lastId);
      setHasMore(response.data.hasMore);
    } catch (error) {
      const errMessage = JSON.parse(error.request.response);
      toast.error(errMessage.message, {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastId, keyword]);

  const serchData = (e) => {
    e.preventDefault();
    setLastId(0);
    setData([]);
    setKeyword(query);
  };

  const fetchMore = () => {
    setLastId(tempId);
  };

  return (
    <>
      <NavbarComponent />
      <Container>
        <Row className="mt-3 bg-body-tertiary rounded p-3 pb-0">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="#">Transaction</Breadcrumb.Item>
              <Breadcrumb.Item active>Sales History</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row className="mt-3 bg-body-tertiary rounded p-3">
          <Col>
            <Row>
              <Col lg={{ offset: 5, span: 7 }} sm={{ offset: 2, span: 10 }}>
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
            <Row>
              <Col>
                <InfiniteScroll
                  dataLength={data.length}
                  next={fetchMore}
                  hasMore={hasMore}
                  loader={<h4>Loading...</h4>}
                >
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Transaction Code</th>
                        <th>Transaction Date</th>
                        <th className="text-end">Total</th>
                        <th className="text-end">PPN</th>
                        <th className="text-end">Grand Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.code}</td>
                          <td>
                            {new Date(item.date).toLocaleDateString("id-ID")}
                          </td>
                          <td className="text-end">
                            Rp {Number(item.total).toLocaleString("id-ID")}
                          </td>
                          <td className="text-end">
                            Rp {Number(item.ppn).toLocaleString("id-ID")}
                          </td>
                          <td className="text-end">
                            Rp {Number(item.grandTotal).toLocaleString("id-ID")}
                          </td>
                          <td>
                            <Link
                              className="btn btn-primary me-1"
                              to={`/orders/${item.id}`}
                            >
                              <IoPrint /> Print
                            </Link>
                            <Link
                              className="btn btn-primary"
                              to={`/sales-return/${item.id}`}
                            >
                              <BsArrowReturnLeft /> Returns
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </InfiniteScroll>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ListSalesHistory;
