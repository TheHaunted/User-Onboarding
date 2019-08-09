import React, { useState, useEffect } from 'react';
import { Form, Field, withFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

const FormComponent = (props) => {
    console.log(props);
    const [users, setUsers] = useState([])
    useEffect(() => {
        if (props.status) {
            setUsers([...users, props.status]);
        }
    }, [props.status])
    return (
        <Form>
            {props.touched.name && props.errors.name && <p className="error">{props.errors.name}</p>}
            <Field type="text" name="name" placeholder="name" />
            {props.touched.email && props.errors.email && <p className="error">{props.errors.email}</p>}
            <Field type="text" name="email" placeholder="email" />
            {props.touched.password && props.errors.password && <p className="error">{props.errors.password}</p>}
            <Field type="password" name="password" placeholder="password" />
            <label>
                {props.touched.tos && props.errors.tos && <p className="error">{props.errors.tos}</p>}
                <Field type="checkbox" name="tos" />
                Agree to ToS
            </label>
            <button type="submit">Submit</button>
            {users.map(user => <div key={user.id}>{JSON.stringify(user)}</div>)}
        </Form>
    )
}

const FormikForm = withFormik({
    mapPropsToValues: ({ name, email, password, tos }) => {
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            tos: tos || false
        }
    },

    handleSubmit: (values, { resetForm, setStatus }) => {
        console.log("Request");
        axios.post('https://reqres.in/api/users', values)
            .then(res => {
                console.log(res);
                setStatus(res);
                resetForm();
            })
            .catch(error => {
                console.log(error);
            })
    },

    validationSchema: yup.object().shape({
        name: yup.string()
            .required("You must submit a name"),
        email: yup.string()
            .email("You must submit an email")
            .required("Email is required"),
        password: yup.string()
            .min(4, "Password must be at least 4 characters long")
            .required("Please enter a password"),
        tos: yup.boolean()
            .oneOf([true], "Please accept the ToS")
            .required()
    })
})(FormComponent)

export default FormikForm;