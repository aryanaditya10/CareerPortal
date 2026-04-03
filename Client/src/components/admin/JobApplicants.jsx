import React, { useEffect, useRef, useCallback } from 'react'
import Navbar from '../shared/Navbar'
import JobApplicantsTable from './JobApplicantsTable'
import axios from 'axios'
import { backend_url, APPLICANT_API_END_POINT } from '@/utils/constant'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'

const JobApplicants = () => {

    const dispatch = useDispatch();

    const params = useParams();
    const jobId = params.id;

    const { allApplicants } = useSelector(store => store.application)

    // Use a ref to access the latest allApplicants inside socket callbacks
    // without adding it to the useEffect dependency array
    const allApplicantsRef = useRef(allApplicants);
    useEffect(() => {
        allApplicantsRef.current = allApplicants;
    }, [allApplicants]);

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

    const fetchAllApplicants = useCallback(async () => {
        try {
            const response = await axios.get(`${APPLICANT_API_END_POINT}/${jobId}/applicants`, { withCredentials: true });

            if (response.data.success) {
                dispatch(setAllApplicants(response.data.job));
            }
        } catch (error) {
            console.error(error);
        }
    }, [jobId, dispatch]);

    useEffect(() => {
        fetchAllApplicants();
    }, [fetchAllApplicants])

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
                const current = allApplicantsRef.current;
                const updated = {
                    ...current,
                    applications: current.applications.map((item) =>
                        item._id === data.applicationId ? { ...item, status: data.status } : item
                    )
                };
                dispatch(setAllApplicants(updated));
            }
        });

        // When a new application is submitted, re-fetch the full list
        socket.on('newApplication', (data) => {
            if (data.jobId === jobId) {
                fetchAllApplicants();
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [jobId, dispatch, fetchAllApplicants]);

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
