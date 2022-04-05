import * as React from 'react';
import {useEffect, useState} from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import {api} from "../api";
import {axiosError, parseResponse} from "../utils";
import CustomizedSnackbars from "../utils/alerts";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import {Done, Print, PriorityHigh} from "@mui/icons-material";
import {Button} from "@mui/material";
import Box from "@mui/material/Box";
import {AddHostelDialog, AddRoomDialog} from "utils/formDialog";
import IconButton from "@mui/material/IconButton";
import {printHostels, printRooms, printStudents} from "utils/reports/ReportGenerator";

// Generate Order Data
function createData(id, date, name, shipTo, paymentMethod, amount) {
    return {id, date, name, shipTo, paymentMethod, amount};
}

// function rows(id, name, reg_no, email, study_year, study_semester, hostel_id, room_id) {
//     return { id, name, reg_no, email, study_year, study_semester, hostel_id, room_id };
// }

function preventDefault(event) {
    event.preventDefault();
}

function getStudentTable(students, awaitingClearance = false, onError, onInfo) {
    const columns = [
        <TableCell>Name</TableCell>,
        <TableCell>Reg Number</TableCell>,
        <TableCell align={"center"}>Year</TableCell>,
        <TableCell align={"center"}>Hostel</TableCell>,
        <TableCell align={"center"}>Room</TableCell>,
        <TableCell align={"center"}>Amount</TableCell>,
        <TableCell align={"center"}>Paid</TableCell>,
    ];
    if (awaitingClearance) {
        columns.push(<TableCell align={"center"}>Status</TableCell>);
    }

    const rows = students.map((student) => (
        <TableRow key={student.id}>
            <TableCell>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {student.name}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {student.reg_no}
                </Typography>
            </TableCell>
            <TableCell align={"center"}>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {student.study_year}.{student.study_semester}
                </Typography>
            </TableCell>
            <TableCell align={"center"}>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {student.hostel_id ?? "N/A"}
                </Typography>
            </TableCell>
            <TableCell align={"center"}>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {student.room_id ?? "N/A"}
                </Typography>
            </TableCell>
            <TableCell align={"center"}>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    Kshs. {student.room_cost ?? 0}
                </Typography>
            </TableCell>
            <TableCell align={"center"}>
                <Badge badgeContent={parseInt(student.paid) > 0 ? <Done/> : <PriorityHigh/>}
                       color={parseInt(student.paid) > 0 ? "success" : "error"} variant="gradient" size="md"
                       style={{cursor: "pointer"}}/>
            </TableCell>
            {awaitingClearance ?
                <TableCell align={"center"}>
                    <Typography component="button" variant="caption" color="text" fontWeight="bold"
                                onClick={() =>
                                    (typeof student.awaiting_clearance === "undefined" || student.awaiting_clearance == null)
                                        ? {} : parseInt(student.awaiting_clearance) === 1
                                            ? clearStudents(true, student.reg_no, student.room_id, onError, onInfo) : {}}
                    >
                        {(typeof student.awaiting_clearance === "undefined" || student.awaiting_clearance == null)
                            ? "Not requested" : parseInt(student.awaiting_clearance) === 1 ? "Approve clearance" : "Already cleared"}
                    </Typography>
                </TableCell> : ""
            }
        </TableRow>
    ));

    return {columns, rows}
}

function getHostelTable(hostels) {
    const columns = [
        <TableCell>Hostel ID</TableCell>,
        <TableCell>Name</TableCell>,
        <TableCell align={"center"}>All rooms</TableCell>,
        <TableCell align={"center"}>Available rooms</TableCell>,
        // <TableCell>Name</TableCell>,
        // <TableCell  align={"center"}>Active</TableCell>,
    ];

    const rows = hostels.map((hostel) => (
        <TableRow key={hostel.id}>
            <TableCell>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {hostel.id}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {hostel.name}
                </Typography>
            </TableCell>
            <TableCell align={"center"}>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {hostel.num_rooms}
                </Typography>
            </TableCell>
            <TableCell align={"center"}>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {hostel.num_available_rooms ?? "--"}
                </Typography>
            </TableCell>
            {/*<TableCell align={"center"}>{hostel.active === 0 ? "Inactive" : "Active"}</TableCell>*/}
        </TableRow>
    ));

    return {columns, rows}
}

function getRoomsTable(rooms, setSuccess, setError) {
    const columns = [
        <TableCell>Name</TableCell>,
        <TableCell>Hostel</TableCell>,
        <TableCell>Cost</TableCell>,
        <TableCell align={"left"}>Active</TableCell>,
        <TableCell align={"center"}>Action</TableCell>,
    ];

    const rows = rooms.map((room) => (
        <TableRow key={room.id}>
            <TableCell>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {room.name}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {room.hostel_name}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {room.room_cost}
                </Typography>
            </TableCell>
            <TableCell align={"left"}>
                <Typography component="text" variant="caption" color="text" fontWeight="bold">
                    {parseInt(room.active) === 0 ? "Inactive" : "Active"}
                </Typography>
            </TableCell>
            <TableCell align={"center"}>
                <Badge badgeContent={parseInt(room.active) === 0 ? "Activate" : "Deactivate"}
                       color={parseInt(room.active) === 0 ? "success" : "error"} variant="gradient" size="sm"
                       onClick={async () => {
                           await toggleActive(room, parseInt(room.active) === 1, setSuccess, setError);
                       }}
                       style={{cursor: "pointer"}}
                />
            </TableCell>
        </TableRow>
    ));

    return {columns, rows};
}

function getAdminsTable(admins) {
    const columns = [
        <TableCell>Username</TableCell>,
        <TableCell>Email</TableCell>,
    ];

    const rows = admins.map((admin) => (
        <TableRow key={admin.id}>
            <TableCell>{admin.username}</TableCell>
            <TableCell>{admin.email}</TableCell>
        </TableRow>
    ));

    return {columns, rows}
}

async function toggleActive({id, name, hostel_id, room_cost}, active, onSuccess, onError) {
    let data = {};
    let error = null;

    // console.log(id, name, hostel_id, active);

    function setData(d) {
        data = d;
        if (parseInt(d) === 1 && onSuccess) {
            onSuccess("Updated successfully");
        } else if (parseInt(d) === 0 && onSuccess) {
            onSuccess("The record was not changed sinc it was the same.");
        }
    }

    function setError(e) {
        error = e;
        if (onError) onError(e);
    }

    await api().put(
        `rooms/${id}`,
        {
            name, hostel_id, room_cost,
            active: !active
        }
    ).then(response => parseResponse(response, "rowCount", setError, setData))
        .catch(err => axiosError("update room", err, setError));

    return {data, error};
}

async function clearStudents(one, regNo, roomId, onError, onInfo) {
    let success = false;
    let error = null;

    function setError(e) {
        error = e;
        if (onError) onError(e);
    }

    function setInfo(i) {
        if (onInfo) onInfo(i);
    }

    await api()
        .post('students/clearStudent', {reg_no: regNo, room_id: roomId})
        .then(response => {
            const data = response.data;
            if (typeof data["success"] !== "undefined" && data["success"]) {
                setInfo("Student cleared successfully.");
            } else if (typeof data["success"] !== "undefined" && !data["success"]) {
                setError(data["message"] ?? "Operation could not be completed.");
            }
        }).catch(error => axiosError("Clear student", error, setError));
}

export default function Tables({type}) {
    const [data, setData] = useState([]);
    // const [admins, setAdmins] = useState([]);
    // const [hostels, setHostels] = useState([]);
    // const [rooms, setRooms] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [showAddHostelDialog, setShowAddHostelDialog] = useState(false);
    const [showAddRoomDialog, setShowAddRoomDialog] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const [clearingStudent, setClearingStudent] = useState('');

    const requestRefresh = () => {
        setRefresh(!refresh);
        setShowAddHostelDialog(false);
        setShowAddHostelDialog(false);
    }

    const updateInfo = (info) => {
        requestRefresh();
        setInfo(info);
    }

    const dataTypes = [
        "students", // 0
        "admins", // 1
        "hostels", // 2
        "rooms", // 3
        "students-clearance", // 4
    ];

    const handlePrint = () => {
      if (type === dataTypes[0]){
          printStudents(data);
      } else if (type === dataTypes[1]){

      } else if (type === dataTypes[2]){
          printHostels(data);
      } else if (type === dataTypes[3]){
          printRooms(data)
      } else if (type === dataTypes[4]){
          printStudents(data, "Clearance status")
      }
    }

    useEffect(() => {
        if (dataTypes.includes(type)) {
            api().get(
                type === "students-clearance" ? "students" : type
            ).then(response => parseResponse(response, type === "students-clearance" ? "students" : type, setError, setData))
                .catch(err => axiosError("fetch students", err, setError));
        } else setError("Cannot fetch undefined type.")
    }, [type, refresh]);

    const table = type === dataTypes[0]
        ? getStudentTable(data, false, setError, setInfo)
        : type === dataTypes[4] ? getStudentTable(data, true, setError, setInfo)
            : type === dataTypes[1] ? getAdminsTable(data)
                : type === dataTypes[2] ? getHostelTable(data)
                    : type === dataTypes[3] ? getRoomsTable(data, updateInfo, setError)
                        : {columns: [], rows: []};

    return (
        <React.Fragment>
            <Box display="flex" >
                <Title>All {type}</Title>
                <Box ml="auto">
                    <IconButton color={"info"} onClick={handlePrint}>
                        <Print />
                    </IconButton>
                </Box>
            </Box>
            {error !== null && <CustomizedSnackbars color={"error"} message={error}/>}
            {info !== null && <CustomizedSnackbars color={"info"} message={info}/>}
            {showAddHostelDialog && <AddHostelDialog onError={setError} onInfo={setInfo} onUpdate={requestRefresh}/>}
            {showAddRoomDialog && <AddRoomDialog onError={setError} onInfo={setInfo} onUpdate={requestRefresh}/>}
            {type === "students" ? (
                // <Box mt={2} mb={5} ml="auto" display="flex">
                //     <Input type={"text"} onChange={(e) => setClearingStudent(e.target.value)}
                //            aria-label="clear student" placeholder={"Enter reg number"}/>
                //     <Input type={"text"} onChange={(e) => setClearingRoomId(e.target.value)}
                //            aria-label="clear student" placeholder={"Enter room id"}/>
                //     <Box ml={2} my="auto">
                //         <Button variant={"contained"} size={"small"} onClick={() => {
                //             if (clearingStudent !== '') {
                //                 clearStudents(true, clearingStudent, setError, setInfo).then(r => {
                //                 });
                //             } else {
                //                 setInfo("Enter a reg number to clear.");
                //             }
                //         }} type={"button"} color={"primary"}>Clear</Button>
                //     </Box>
                // </Box>
                ''
            ) : type === "hostels" ?
                <Box ml="auto" mt={1} mb={1} mr={5} fullWidth display="flex" alignContent="center"
                     justifyContent="space-between" style={{}}>
                    <Box my="auto">
                        <Box ml={0} my="auto">
                            <Button variant={"text"} size={"small"} onClick={() => {
                                setShowAddHostelDialog(true);
                            }} type={"button"} color={"primary"}>Create new hostel</Button>
                        </Box>
                    </Box>
                </Box>
                : type === "rooms" ?
                    <Box ml="auto" mt={1} mb={1} mr={5} fullWidth display="flex" alignContent="center"
                         justifyContent="space-between" style={{}}>
                        <Box my="auto">
                            <Box ml={0} my="auto">
                                <Button variant={"text"} size={"small"} onClick={() => {
                                    setShowAddRoomDialog(true);
                                }} type={"button"} color={"primary"}>Create new room</Button>
                            </Box>
                        </Box>
                    </Box>
                    : ""
            }
            <Table size="small">
                <TableHead>
                    {table.columns}
                </TableHead>
                <TableBody>
                    {table.rows}
                </TableBody>
            </Table>
        </React.Fragment>
    );
}