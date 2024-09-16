import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import portraitImage from '../../assets/portrait.png';
import landscapeImage from '../../assets/landscape.png';
import streetImage from '../../assets/street.png';
import wildlifeImage from '../../assets/wild.png';
import abstractImage from '../../assets/abstract.png';
import ContestInfo from './ContestInfo';
import Ranking from './Ranking';
import SubmissionsList from './SubmissionsList';
import ContestRules from './ContestRules.jsx';
import JoinContestModalForm from '../Forms/SubmissionForm.jsx';
import EditSubmissionModalForm from '../Forms/UpdateSubmissionForm';
import classes from './Details.module.css';
import { getId } from "../../utils/jwtUtils.jsx";

export default function ContestDetail({ contest, rankedUsers }) {
    const [selectedTab, setSelectedTab] = useState('submissions');
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const categoryToImageMap = {
        'PORTRAIT': portraitImage,
        'LANDSCAPE': landscapeImage,
        'STREET': streetImage,
        'WILDLIFE': wildlifeImage,
        'ABSTRACT': abstractImage,
    };

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const image = categoryToImageMap[contest.category?.toUpperCase()] || abstractImage;

    const buttonStyle = (tab) => ({
        fontSize: '1.2rem',
        backgroundColor: selectedTab === tab ? '#393E46' : 'rgba(12,12,12,0.38)',
        border: 'none',
        borderRadius: '12px 12px 0 0',
        padding: '1rem 3vw',
        transition: 'all 0.3s ease',
        boxShadow: 'none',
    });

    return (
        <>
            <div className={classes.detailContainer}>
                <Box
                    display={'flex'}
                    alignItems={'center'}
                    flexDirection={'column'}
                    sx={{
                        position: 'relative',
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        height: '50vh',
                        width: '100%',
                        overflow: 'hidden',
                        borderRadius: '16px',
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(2px)',
                            padding: '2rem',
                            borderRadius: '1rem',
                            textAlign: 'center',
                        }}
                    >
                        <Typography
                            variant="body1"
                            component="div"
                            sx={{
                                fontSize: '1.2rem',
                            }}
                        >
                            <ContestInfo
                                contest={contest}
                                setShowJoinModal={setShowJoinModal}
                                setShowEditModal={setShowEditModal}
                            />
                        </Typography>
                    </Box>
                </Box>

                <Box
                    sx={{
                        backgroundColor: 'transparent',
                        width: '100%',
                        padding: '1rem 0',
                        marginTop: '1rem',
                        boxShadow: 'none',
                    }}
                >
                    <Box display={'flex'} justifyContent="flex-start" width="100%" overflow="hidden">
                        <Button
                            variant="contained"
                            sx={{
                                ...buttonStyle('submissions'),
                                marginRight: '2px',
                                marginLeft: 0,
                                padding: '1vh 8vw',
                                flexGrow: 1,
                                overflow: 'hidden',
                            }}
                            onClick={() => handleTabChange('submissions')}
                        >
                            Entries
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                ...buttonStyle('ranking'),
                                marginRight: '2px',
                                padding: '1vh 8vw',
                                flexGrow: 1,
                                overflow: 'hidden',
                            }}
                            onClick={() => handleTabChange('ranking')}
                        >
                            Ranking
                        </Button>
                        <Button
                            variant="contained"
                            sx={{
                                ...buttonStyle('details'),
                                padding: '1vh 8vw',
                                flexGrow: 1,
                                overflow: 'hidden',
                            }}
                            onClick={() => handleTabChange('details')}
                        >
                            Details
                        </Button>
                    </Box>

                    <Box
                        sx={{
                            marginTop: '0',
                            padding: '1rem',
                            backgroundColor: '#393E46',
                            borderRadius: '0 0 12px 12px',
                            boxShadow: '0px 4px 8px -2px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        {selectedTab === 'details' && <ContestRules contest={contest} />}
                        {selectedTab === 'submissions' && (
                            contest.photoSubmissions.length > 0 ? (
                                <SubmissionsList itemData={contest.photoSubmissions} />
                            ) : (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    height={"20vh"}

                                >
                                    <Typography variant="h6" color="white" >
                                        No photo submissions yet. Be the first to participate!
                                    </Typography>
                                </Box>
                            )
                        )}

                        {selectedTab === 'ranking' && (
                            rankedUsers.length > 0 ? (
                                <Ranking
                                    rankedUsers={rankedUsers}
                                    juryCount={contest.jury.length}
                                    submissions={contest.photoSubmissions}
                                />
                            ) : (
                                <Box
                                    display="flex"
                                    justifyContent="center"
                                    alignItems="center"
                                    height={"20vh"}
                                >
                                    <Typography variant="h6" color="white">
                                        No rankings available yet. Check back later for the results!
                                    </Typography>
                                </Box>
                            )
                        )}
                    </Box>
                </Box>
            </div>

            {showJoinModal && <JoinContestModalForm onClose={() => setShowJoinModal(false)} contestId={contest.id} />}
            {showEditModal && (
                <EditSubmissionModalForm
                    onClose={() => setShowEditModal(false)}
                    submission={contest.photoSubmissions.find(
                        (s) => s.creator.id === getId(localStorage.getItem("accessToken"))
                    )}
                />
            )}
        </>
    );
}
