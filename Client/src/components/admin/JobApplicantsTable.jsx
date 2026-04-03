import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICANT_API_END_POINT } from '@/utils/constant';
import { setAllApplicants } from '@/redux/applicationSlice';


const shortListingStatus = ["Accepted", "Rejected"];

const JobApplicantsTable = () => {

    const dispatch = useDispatch();
    const { allApplicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        if (!window.confirm(`Confirm ${status.toLowerCase()} this application? This operation is irreversible.`)) {
            return;
        }

        try {
            const response = await axios.post(`${APPLICANT_API_END_POINT}/status/${id}/update`,
                { status }, {
                withCredentials: true
            })

            if (response.data.success) {
                toast.success(response.data.message);

                const updated = {
                    ...allApplicants,
                    applications: allApplicants.applications.map((item) =>
                        item._id === id ? { ...item, status: status.toLowerCase() } : item
                    )
                };

                dispatch(setAllApplicants(updated));
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Failed to update status.');
        }
    }


    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {
                        allApplicants && allApplicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell>
                                    {
                                        item?.applicant?.profile?.resume
                                            ?
                                            <a
                                                className="hover:text-blue-600 cursor-pointer"
                                                href={item.applicant?.profile?.resume}
                                                target='_blank'>
                                                {item.applicant?.profile?.resumeOriginalName}
                                            </a>
                                            :
                                            <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.createdAt.split("T")[0]}</TableCell>
                                <TableCell>
                                    {item?.status === 'accepted' && <span className='text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold'>Accepted</span>}
                                    {item?.status === 'rejected' && <span className='text-red-700 bg-red-100 px-2 py-1 rounded-full text-xs font-semibold'>Rejected</span>}
                                    {(!item?.status || item?.status === 'pending') && <span className='text-gray-700 bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold'>Pending</span>}
                                </TableCell>
                                <TableCell className="float-right text-right">
                                    {item?.status !== 'pending' ? (
                                        <span className='text-sm text-gray-500'>Action locked</span>
                                    ) : (
                                        <Popover>
                                            <PopoverTrigger>
                                                <MoreHorizontal className='cursor-pointer' />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32">
                                                {
                                                    shortListingStatus?.map((status, index) => {
                                                        return (
                                                            <div key={index} className='flex w-fit items-center my-2 cursor-pointer' onClick={() => statusHandler(status, item._id)}>
                                                                <span className='cursor-pointer'>{status}</span>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </PopoverContent>
                                        </Popover>
                                    )}
                                </TableCell>
                            </tr>
                        ))
                    }


                </TableBody>

            </Table>
        </div>
    )
}

export default JobApplicantsTable
