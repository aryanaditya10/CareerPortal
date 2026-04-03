import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import JobApplicantsTable from './JobApplicantsTable'
import axios from 'axios'
import { backend_url } from '@/utils/constant'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'
import { io } from 'socket.io-client'

const JobApplicants = () => {

    const dispatch = useDispatch();

    const params = useParams();
    const jobId = params.id;

    const { allApplicants } = useSelector(store => store.application)

    const getToken = () => {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'token') {
                return value;
            }
        }
        return null;
    };

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const response = await axios.get(`${APPLICANT_API_END_POINT}/${jobId}/applicants`, { withCredentials: true });

                if (response.data.success) {
                    dispatch(setAllApplicants(response.data.job));
                }
                // console.log(response.data);


            } catch (error) {
                console.error(error);
            }
        }
        fetchAllApplicants();
    }, [])

    useEffect(() => {
        const token = getToken();
        if (!token) return;

        // Connect to Socket.io
        const socket = io(backend_url, {
            auth: {
                token
            }
        });

        socket.on('statusUpdated', (data) => {
            // Update the state if the job matches
            if (data.jobId === jobId) {
                const updated = {
                    ...allApplicants,
                    applications: allApplicants.applications.map((item) =>
                        item._id === data.applicationId ? { ...item, status: data.status } : item
                    )
                };
                dispatch(setAllApplicants(updated));
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [jobId, allApplicants, dispatch]);

    return (
        <div>
            <Navbar />

            <div className='px-[5%]'>
                <h1 className='font-bold text-xl my-5'>Applicants {allApplicants?.applications?.length || 0}</h1>
                <JobApplicantsTable />
            </div>
        </div>
    )
}

export default JobApplicants
