import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { AiOutlineEye } from "react-icons/ai";
import { showError, showSucess } from "../helper/heper";
import { httpGet, httpPost } from "../Action";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [allDepartment, setAllDepartment] = useState([])
  const [allDesignation, setAllDesignation] = useState([])
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    department: "",
    designation: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    getDeprtments()
  },[])

  useEffect(() => {
    if(formData.department){
     getDesignation()
    }
  },[formData.department])

  const getDeprtments = async()=> {
   const department = await httpGet('department/')
   console.log('daqta',department.data);
   setAllDepartment(department.data);
  }

  const getDesignation = async()=> {
    const department = await httpGet(`designation/department/${formData?.department}`)
    console.log('daqta',department.data);
    setAllDesignation(department.data);
   }
  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
   
  };

  const submit = async (e) => {
    e.preventDefault();

    const response = await httpPost("user/sign/up", formData);
    if (response.status == "400") {
      console.log('err');
      showError(response.message);
    } else {
      setFormData ({
        email: "",
        password: "",
        name: "",
        department: "",
        designation: "",
      });
      showSucess(response.message);
      navigate('/log-in')
      console.log("res", response.data);
    }
  };

  return (
    <>
    { console.log('weq', formData)}
      <div className="title-bar text-center">
        <h2>Request Access</h2>
        <p>Raise a request for access</p>
      </div>
      <div className="form">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Requester’s Name" value={formData.name} onChange={(e) =>onChange(e)} name='name' />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email ID</Form.Label>
            <Form.Control type="email" placeholder="Requester’s Email ID" value={formData.email} onChange={(e) =>onChange(e)} name='email'/>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Department</Form.Label>
            <Form.Select onChange={(e) =>onChange(e)} name='department' value={formData.department}>
            <option value="">Requester’s Department</option>
            {allDepartment.map((item) => <>
              <option value={item._id}>{item.name}</option>
               </>)}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Designation</Form.Label>
            <Form.Select onChange={(e) =>onChange(e)} name='designation' value={formData.designation}>
              <option value="">Requester’s Designation</option>
              {allDesignation.map((item) => <>
              <option value={item._id}>{item.name}</option>
               </>)}
            </Form.Select>
          </Form.Group>

          <Form.Label>Your password</Form.Label>

          <InputGroup className="mb-3 formeye">
            <Form.Control 
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
             placeholder="Enter your password" onChange={(e) =>onChange(e)} name='password'/>
            <InputGroup.Text onClick={(e)=>setShowPassword(!showPassword)} id="basic-addon2">
              <AiOutlineEye />
            </InputGroup.Text>
          </InputGroup>

          <Button className='btnblack' type="submit" onClick={submit}>
            Submit
          </Button>
        </Form>
      </div>
    </>
  );
};

export default SignUp;
