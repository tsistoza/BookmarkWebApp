import type { ReactNode } from "react";
import { useParams } from "react-router";
import UpdateBookmark from "../Pages/UpdateBookmark";

const UpdateWrapper = (): ReactNode => {
    const { id } = useParams();

    return (
        <UpdateBookmark id={id} />
    );
};

export default UpdateWrapper;
