import { Button, Col, Image, Row, Steps, Table } from "antd";
import Modal from "antd/lib/modal/Modal";
import React, { useEffect, useState } from "react";
import { getketQua, getOneCauHinh } from "../api";
import CheckboxCustom from "../components/CheckboxCustom";
import HomeLayout from "../components/HomeLayout";
import RadioCustom from "../components/RadioCustom";

const { Step } = Steps;
export default function AdvisePage() {
  const [current, setCurrent] = useState(0);
  const [stepOne, setStepOne] = useState([]);
  const [stepTwo, setStepTwo] = useState([]);
  const [stepThree, setStepThree] = useState([]);
  const [stepFour, setStepFour] = useState([]);
  const [stepFive, setStepFive] = useState([]);
  const [valueOne, setValueOne] = useState();
  const [valueTwo, setValueTwo] = useState();
  const [valueThree, setValueThree] = useState();
  const [valueFour, setValueFour] = useState();
  const [valueFive, setValueFive] = useState();
  const [result, setResult] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState([]);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const cauhinh1 = await getOneCauHinh("MD");
      const cauhinh2 = await getOneCauHinh("H");
      const cauhinh3 = await getOneCauHinh("MH");
      const cauhinh4 = await getOneCauHinh("G");
      const cauhinh5 = await getOneCauHinh("K");
      setStepOne(cauhinh1.data.data);
      setStepTwo(cauhinh2.data.data);
      setStepThree(cauhinh3.data.data);
      setStepFour(cauhinh4.data.data);
      setStepFive(cauhinh5.data.data);
    };
    fetchData();
  }, []);
  const handleClick = async () => {
    const body = [valueOne, valueTwo, valueThree, valueFour, valueFive]
      .filter((e) => e !== null && e !== undefined && e !== "")
      .join(" ^ ");
    const response = await getketQua(body);
    console.log(body);
    setResult(response.data.laptop);
    setData(response.data.data);

    if (response.data.success) {
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCancelGT = () => {
    setIsVisible(false);
  };

  const steps = [
    {
      title: "M???c ????ch",
      content: <RadioCustom setValue={setValueOne} array={stepOne} />,
    },
    {
      title: "H??ng s???n xu???t",
      content: <RadioCustom setValue={setValueTwo} array={stepTwo} />,
    },
    {
      title: "K??ch th?????c m??n h??nh",
      content: <RadioCustom setValue={setValueThree} array={stepThree} />,
    },
    {
      title: "Gi?? ti???n",
      content: <RadioCustom setValue={setValueFour} array={stepFour} />,
    },
    {
      title: "T??nh n??ng kh??c",
      content: <CheckboxCustom setValue={setValueFive} array={stepFive} />,
    },
  ];

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "r",
      dataIndex: "r",
      key: "r",
    },
    {
      title: "TG",
      dataIndex: "TG",
      key: "TG",
    },
    {
      title: "SAT",
      key: "SAT",
      dataIndex: "SAT",
    },
  ];

  // B???t ?????u x??? l?? gi???i th??ch suy di???n ti???n
  let r = "";
  let TG = `${valueOne},${valueTwo},${valueThree},${valueFour},${
    valueFive ? valueFive : ""
  }`.replaceAll(" ^ ", ",");
  const dataGT = [];
  const SAT = data.map((e) => e.key);

  for (let i = 0; i <= data.length; i++) {
    if (i > 0) {
      SAT.shift();
      r = data[i - 1].key;
    }

    if (i > 0 && TG.split(",").indexOf(data[i - 1].vephai) === -1) {
      TG = `${TG}${data[i - 1].vephai},`.replace(" ^ ", ",");
    }

    dataGT.push({
      index: i,
      r,
      TG,
      SAT: SAT.join(","),
    });
  }
  // K???t th??c x??? l?? gi???i th??ch suy di???n ti???n

  return (
    <HomeLayout>
      <h1 style={{ textAlign: "center", paddingBottom: 30 }}>
        T?? V???N CH???N MUA LAPTOP
      </h1>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action" style={{ textAlign: "center" }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Ti???p theo
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={handleClick}>
            Ho??n th??nh
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Quay l???i
          </Button>
        )}
      </div>

      {/* Modal result */}
      <Modal
        footer={null}
        title=""
        visible={isModalVisible}
        onCancel={handleCancel}
        width={900}
      >
        <div style={{ marginBottom: 10 }}>
          <Button
            type="primary"
            style={{ marginLeft: 40 }}
            onClick={() => setIsVisible(true)}
          >
            Gi???i th??ch
          </Button>
        </div>
        {result.length ? (
          result.map((e) => (
            <div>
              <h2>{e.name}</h2>
              <Row>
                <Col span={12}>
                  <Image
                    width={400}
                    src={e.avatar}
                    style={{ textAlign: "center" }}
                  />
                </Col>
                <Col span={12}>
                  <div style={{ marginLeft: 20 }}>
                    <p style={{ color: "red", fontWeight: "bold" }}>
                      {e.price.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p style={{ fontWeight: "bold" }}>Th??ng tin c???u h??nh</p>
                    </div>
                    <div>
                      <table>
                        <tbody>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>RAM</td>
                            <td>{e.RAM}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>CPU</td>
                            <td>{e.CPU}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>ROM</td>
                            <td>{e.ROM}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>screen</td>
                            <td>{e.screen}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>Card</td>
                            <td>{e.card}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>H??? ??i???u h??nh</td>
                            <td>{e.os}</td>
                          </tr>
                          <tr>
                            <td style={{ fontWeight: "bold" }}>K??ch th?????c</td>
                            <td>{e.size}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          ))
        ) : (
          <h2 style={{ textAlign: "center" }}>
            Kh??ng t??m ???????c m??y t??nh theo y??u c???u c???a b???n
          </h2>
        )}
      </Modal>

      {/* Modal gi???i th??ch */}
      <Modal
        footer={null}
        title=""
        visible={isVisible}
        onCancel={handleCancelGT}
        width={1200}
      >
        <h4 style={{ textAlign: "center", textTransform: "uppercase" }}>
          D???a v??o nh???ng th??ng tin b???n v???a ch???n, ta c?? b???ng gi???i th??ch b???ng thu???t
          to??n suy di???n ti???n nh?? sau
        </h4>
        <Table columns={columns} dataSource={dataGT} pagination={false} />
        <h2 style={{ textAlign: "center" }}>
          B???n ???? t??m ???????c {result.length} c??i laptop ph?? h???p
        </h2>
      </Modal>
    </HomeLayout>
  );
}
