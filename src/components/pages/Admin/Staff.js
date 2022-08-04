import axios from "axios";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import Container from "../../atoms/Container";
import Text from "../../atoms/Text";
import SubText from "../../atoms/SubText";
import Input from "../../atoms/Input";
import Button from "../../atoms/Button";
import Spinner from "../../atoms/Spinner";
import Image from "../../atoms/Image";

import { useStaff } from "../../../hooks/useStaff";

import axiosInstance from "../../../utils/axios";

const Staff = () => {
    const { staff, mutate } = useStaff();

    const [creating, setCreating] = useState(false)
    const [staffUpdate, setStaffUpdate] = useState(null)
    const [loading, setLoading] = useState(false)

    const create = () => setCreating(true)
    const setUpdate = (staff) => setStaffUpdate(staff)
    const cancel = () => {
        setCreating(false)
        setStaffUpdate(null)
    }

    const onSubmit = async (data) => {
        setLoading(true)
        const formData = new FormData();
        formData.append("file", data.image);
        formData.append("upload_preset", `flashtradefx_public`);

        try {
            const { data: { secure_url } } = await axios.post(
                `https://api.cloudinary.com/v1_1/flashtradefx/image/upload`,
                formData
            );
            if (staffUpdate) {
                await axiosInstance.put(`/staff/${staffUpdate._id}`, {
                    ...data, image: secure_url
                });
            } else {
                await axiosInstance.post("/staff", {
                    ...data, image: secure_url
                });
            }
            mutate();
        } catch (err) {
            console.log(err.response);
        } finally {
            setLoading(false)
            cancel()
        }
    };

    const remove = async (id) => {
        try {
            await axiosInstance.delete(`/staff/${id}`);
            mutate();
        } catch (err) {
            console.log(err.response);
        }
    };

    return (
        <>
            <Container p="12px" borderbottom="1px solid" wide>
                <Text font="16px" p="12px 0" bold>
                    Staff List
                </Text>
                <Text p="12px 0" font="12px" opacity="0.6" bold multiline>
                    Create staff
                </Text>
            </Container>

            <Container p="12px" flex="flex-end" wide>
                <Text
                    p="6px 12px"
                    radius="4px"
                    bg="primary"
                    color="white"
                    font="11px"
                    bold="true"
                    flexalign="true"
                    onClick={(creating || staffUpdate) ? cancel : create}
                >
                    {(creating || staffUpdate) ? "Cancel" : "Create Staff"}
                    <SubText p="0" m="0 0 0 8px" font="inherit" flexalign>
                        {(creating || staffUpdate) ? <FaTimes /> : <FaPlus />}
                    </SubText>
                </Text>
            </Container>

            {creating ? (
                <StaffForm action="Create" onSubmit={onSubmit} loading={loading} />
            ) : staffUpdate ? (
                <StaffForm action="Update" onSubmit={onSubmit} loading={loading} defaultValues={staffUpdate} />
            ) : (
                <Container p="12px" wide>
                    {!staff?.length && (
                        <Container minH="240px" flexCol="center">
                            <Text opacity="0.6" bold>
                                You have no staff
                            </Text>
                        </Container>
                    )}
                    {staff?.map((staff) => (
                        <Container
                            p="12px"
                            m="12px 0"
                            border="1px solid"
                            radius="12px"
                            flex="space-between"
                            wide="true"
                            pointer
                            key={staff._id}
                        >
                            <Image onClick={() => setUpdate(staff)} w="80px" h="80px" m="0 16px 0 0" src={staff.image} />
                            <Container flexCol="flex-start" flexAuto wide>
                                <Text font="12px" p="0" m="0 0 4px 0" bold>
                                    {staff.name}
                                </Text>
                                <Text font="10px" p="0" opacity="0.6">
                                    {staff.role}
                                </Text>
                            </Container>
                            <Container onClick={() => remove(staff._id)} h="50px" w="60px" color="danger" flex="center">
                                <FaTrash />
                            </Container>
                        </Container>
                    ))}
                </Container>
            )}
        </>
    );
};

function StaffForm({ action, onSubmit, loading, defaultValues }) {
    const inputRef = useRef();
    const [document, setDocument] = useState();
    const [error, setError] = useState(null);

    const handleDocument = (e) => {
        const file = e.target.files[0];
        setError(null);
        setDocument(null);
        if (file) {
            if (file.size / 1024 ** 2 > 10) {
                setError("File too large, max file size is 10 MB");
                return
            }
            setDocument(file);
        }
    };

    const staffSchema = yup.object().shape({
        name: yup.string().required("Name is required"),
        role: yup.string().required("Role is required"),
    });

    const { register, handleSubmit, formState, errors } = useForm({
        resolver: yupResolver(staffSchema),
        defaultValues
    });

    const { isSubmitting } = formState;

    const onFormSubmit = (data) => {
        if (!document) {
            return setError("Please select file")
        }
        onSubmit({ ...data, image: document })
    }

    return (
        <Container as="form" p="12px" wide onSubmit={handleSubmit(onFormSubmit)}>
            <Input
                label="Name"
                placeholder="Name"
                error={errors.name?.message}
                radius="8px"
                ref={register}
                name="name"
            />
            <Input
                label="Role"
                placeholder="Role"
                error={errors.role?.message}
                radius="8px"
                ref={register}
                name="role"
            />

            <input ref={inputRef} type="file" onChange={handleDocument} hidden />

            <Container p="12px 0" flex="space-between" wide>
                <Text>{document?.name || "No file chosen"}</Text>
                <Button type="button" p="6px" bg="primary" onClick={() => inputRef.current.click()}>
                    {document ? "Choose another file" : "Choose file"}
                </Button>
            </Container>

            {error && (
                <Text p="0" m="4px 0 0 0" align="center" color="danger" bold>
                    {error}
                </Text>
            )}

            <Button
                bg="primary"
                m="24px 0 0 0"
                radius="6px"
                bold
                full
                disabled={isSubmitting}
            >
                {loading ? <Spinner /> : action}
            </Button>
        </Container>
    )
}

export default Staff;
