/* eslint-disable array-callback-return */
import React, { useContext, useState } from 'react';
import UserContext from '../../context/UserContext';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

import {
    Box,
    Collapse,
    IconButton,
    Typography,
  } from "@mui/material";

import "./Dashboard.css";

const Dashboard = ({ releaseSchedule, announcements }) => {
    const { user } = useContext(UserContext);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const priorityColorMap = {
        critical: "error",
        very_important: "warning",
        important: "primary",
        normal: "success",
        not_important: "info"
    };

    function createAnnouncementData(id, title, author, date, content) {
        return { id, title, author, date, content };
    }

    const announcementRows = announcements.map((item) =>
        createAnnouncementData(item.id, item.title, item.author, item.date, item.content)
    );

    function createReleaseScheduleData(id, date, description, priority) {
        if (priority === 'normal') priority = 'success'
        return { id, date, description, priority }
    }

    const releaseScheduleRows = releaseSchedule.map((item) => 
        createReleaseScheduleData(item.id, item.date, item.description, item.priority)
    );

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };


    function Row({ row }) {
        const [open, setOpen] = useState(false);
    
        return (
          <>
            <TableRow>
              <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                  {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
              </TableCell>
              <TableCell component="th" scope="row">
                {row.title}
              </TableCell>
              <TableCell align="right">{row.author}</TableCell>
              <TableCell align="right">{row.date}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell style={{ borderBottom: 'none', paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box sx={{ margin: 1 }}>
                    <Typography variant="body1" gutterBottom component="div">
                      {row.content}
                    </Typography>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </>
        );
      }

    return (
    <>
    { user && user.is_authenticated ?
    <div>
        <h1 className="dashboard-header">Hello,
          <span className="dashboard-username"> {user.username}</span>
          <br></br>
          <span className="dashboard-welcome">Welcome back!</span>
        </h1>
    </div> 
    : "" }

    <div className="dashboard">
        <div className="left-column">
            <div className="card">
                <div className="card-header">
                    <h2>Notice</h2>
                </div>

                <TableContainer component={Paper} elevation={0}>
                    <Table stickyHeader aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: "5%"}}/>
                            <TableCell sx={{ width: "50%"}}>Title</TableCell>
                            <TableCell sx={{ width: "25%"}} align="right">Author</TableCell>
                            <TableCell sx={{ width: "20%"}} align="right">Date</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {announcementRows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => (
                            <Row key={row.id} row={row} />
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={announcementRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </div>

        <div className="right-column">
            <div className="card">
                <div className="card-header">
                    <h2>Schedule</h2>
                </div>

                <Timeline
                    sx={{
                        [`& .${timelineItemClasses.root}:before`]: {
                        flex: 0,
                        padding: 0,
                        },
                    }}
                    >
                    
                    {releaseScheduleRows.map((e, index) => (
                        <TimelineItem key={e.id}>
                            <TimelineSeparator>
                            <TimelineDot color={priorityColorMap[e.priority]} variant="outlined"/>
                            {index !== releaseScheduleRows.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                {e.date}
                                <br></br>
                                {e.description}
                            </TimelineContent>
                        </TimelineItem>
                    ))}
                </Timeline>
            </div>
        </div>
    </div>
    </>
    )
}

export default Dashboard;
