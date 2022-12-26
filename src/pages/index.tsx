import { type NextPage } from "next";
import Modal from "react-modal";

import { trpc } from "../utils/trpc";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";

const modalCustomStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
};

const ModalCreateMode = "CREATE";
const ModalJoinMode = "JOIN";
const DefaultModalMode = ModalCreateMode;
type ModalMode = typeof ModalCreateMode | typeof ModalJoinMode;

type ModalStatusType = {
    isModalOpen: boolean;
    modalMode: ModalMode;
};

type DatetimeRange = {
    datetimeMode: "FREE" | "BUSY";
    start: Date;
    end: Date;
};

type AttendeeType = {
    name : string;
    datetimeRange: DatetimeRange[];
};

type MeetingRoomType = {
    id: number;
    title : string;
    secret: string;
    startTime: Date;
    endTime: Date;
    attendees: AttendeeType[];
    actualStartTime: Date;
    actualEndTime: Date;
    createdAt: Date;
};

type BasedModalComponentType = {
    modelStatus: ModalStatusType;
    closeModal: () => void;
};

type CreateRoomModalComponentType = BasedModalComponentType & {
    createRoom: (
        title: string, startTime : Date, endTime : Date, numberOfAttendees : number
    ) => Promise<boolean>;
};

type JoinRoomModalComponentType = BasedModalComponentType & {
    joinRoom: (
        secret: string, name: string
    ) => Promise<boolean>;
};

const CreateRoomModalComponent: React.FC<CreateRoomModalComponentType> = ({
    modelStatus,
    closeModal,
    createRoom,
}) => {
    const [roomTitle, setRoomTitle] = useState<string>("");
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date());
    const [numberOfAttendees, setNumberOfAttendees] = useState<number>(1);

    const clearAndCloseModal = () => {
        setRoomTitle("");
        setStartTime(new Date());
        setEndTime(new Date());
        setNumberOfAttendees(1);
        closeModal();
    };

    return (
        <Modal
            isOpen={modelStatus.isModalOpen}
            onRequestClose={clearAndCloseModal}
            style={modalCustomStyles}
            contentLabel="Example Modal"
        >
            <div className="row">
                <div className="col">
                    <h2>
                        Create Room
                    </h2>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Meeting Room Title"
                            value={roomTitle}
                            onChange={(e) => setRoomTitle(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col">
                    <div className="input-group">
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={startTime.toISOString().slice(0, 16)}
                            onChange={(e) => setStartTime(new Date(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col">
                    <div className="input-group">
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={endTime.toISOString().slice(0, 16)}
                            onChange={(e) => setEndTime(new Date(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-3">
                <div className="col">
                    <div className="input-group">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Number of Attendees"
                            value={numberOfAttendees}
                            onChange={(e) => setNumberOfAttendees(parseInt(e.target.value))}
                        />
                    </div>
                </div>
            </div>

            <div className="row mt-5 mb-1">
                <div className="col">
                    <button
                        type="button"
                        className="btn btn-success w-100"
                        
                    >
                        Save Change
                    </button>
                </div>
            </div>

            <div className="row mt-1 mb-1">
                <div className="col">
                    <button
                        type="button"
                        className="btn btn-primary w-100"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
};

Modal.setAppElement("#root");


const Home: NextPage = () => {
    const hello = trpc.example.hello.useQuery({ text: "from tRPC" });

    return (
        <>
            <main>
                <div className="container">
                    <h1 className="text-center">Meeting Scheduler</h1>
                    <div className="row">
                        <div className="col-12 text-center">
                            <button
                                type="button"
                                className="btn btn-outline-success"
                            >
                                Create a room
                            </button>
                        </div>
                        <div className="col-12 text-center">
                            <button
                                type="button"
                                className="btn btn-outline-primary"
                            >
                                Join a room
                            </button>

                            <p className="">
                                {hello.data
                                    ? hello.data.greeting
                                    : "Loading tRPC query..."}
                            </p>
                        </div>
                    </div>
                    <AuthShowcase />
                </div>
            </main>
        </>
    );
};

export default Home;

const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();

    const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
        undefined, // no input
        { enabled: sessionData?.user !== undefined }
    );

    return (
        <div className="">
            <p className="">
                {sessionData && (
                    <span>Logged in as {sessionData.user?.name}</span>
                )}
                {secretMessage && <span> - {secretMessage}</span>}
            </p>
            <button
                type="button"
                className="btn btn-primary"
                onClick={sessionData ? () => signOut() : () => signIn()}
            >
                {sessionData ? "Sign out" : "Sign in"}
            </button>
        </div>
    );
};
