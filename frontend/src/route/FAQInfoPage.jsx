import React, { useEffect, useState } from 'react';
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, Box, Link } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FAQInfoPage = () => {
    const [expanded, setExpanded] = useState(false);

    // Function to handle URL hash changes
    const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash) {
            const section = hash.replace("#", "");
            setExpanded(section);
            document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Expand the section based on URL hash when the page loads and when the URL changes
    useEffect(() => {
        handleHashChange(); // Handle the initial load

        // Listen for URL hash changes
        window.addEventListener('popstate', handleHashChange);
        window.addEventListener('hashchange', handleHashChange);

        // Cleanup event listeners when the component unmounts
        return () => {
            window.removeEventListener('popstate', handleHashChange);
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Container maxWidth="md" sx={{ padding: '2rem 0', backgroundColor: 'transparent', color: 'white', fontFamily: 'serif',  margin: "10vh auto" }}>
            <Accordion expanded={expanded === 'rules'} onChange={handleChange('rules')} sx={{ marginBottom: '1rem', backgroundColor: '#393E46', color: 'white' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} id="rules">
                    <Typography variant="h5" component="div">Contest Rules</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1" component="p">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at lorem risus. Aliquam erat volutpat. Vestibulum viverra lorem ac justo dictum tristique.
                        Quisque nec semper dolor, in egestas nulla. Sed accumsan nulla libero, et facilisis dui volutpat in. Vivamus fringilla dolor vel felis dapibus, sit amet tempus lacus consectetur.
                    </Typography>
                    <Typography variant="body1" component="p">
                        Phasellus sit amet orci sit amet justo convallis vehicula. Vivamus vel sem id arcu auctor eleifend. Ut varius nisi vel felis efficitur, nec iaculis justo pellentesque. In in lorem eu augue ultricies tincidunt.
                        Donec ultrices ligula et malesuada suscipit. Ut varius, quam in mollis placerat, arcu nunc venenatis elit, eget dictum lacus lectus nec erat. Donec aliquet felis sit amet ex malesuada, a ullamcorper ligula fermentum.
                    </Typography>
                    <Typography variant="body1" component="p">
                        Nam ultrices mauris ut metus dapibus, vel tristique justo ultricies. Nulla ac libero mi. Etiam malesuada nulla id nunc fringilla, sit amet aliquet nisi pharetra. Integer id leo ac augue auctor viverra non a quam.
                        Pellentesque at justo ut risus gravida congue nec at ex.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* Privacy Policy Section */}
            <Accordion expanded={expanded === 'privacy'} onChange={handleChange('privacy')} sx={{ marginBottom: '1rem', backgroundColor: '#393E46', color: 'white' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} id="privacy">
                    <Typography variant="h5" component="div">Privacy Policy</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1" component="p">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris convallis, est non tempor lacinia, lacus ligula dictum est, ut pretium risus augue vitae arcu. Vivamus sit amet justo eget tortor ultrices suscipit.
                        Sed a velit aliquet, malesuada lacus a, consequat elit. Quisque a elit scelerisque, ullamcorper ante ac, congue dui.
                    </Typography>
                    <Typography variant="body1" component="p">
                        Vestibulum venenatis, nisl vel venenatis tempor, nulla risus accumsan sem, non rhoncus justo lacus eget lectus. Curabitur feugiat ipsum vel libero aliquet, sed dapibus magna scelerisque. Nam tincidunt sapien sit amet lorem gravida suscipit.
                        Ut facilisis felis sit amet dui auctor, in condimentum risus mollis. Phasellus aliquam leo eu libero efficitur, id fermentum orci scelerisque.
                    </Typography>
                    <Typography variant="body1" component="p">
                        Nunc efficitur ultricies purus sit amet fermentum. Suspendisse consequat eros non lectus auctor feugiat. Curabitur commodo, sem id scelerisque congue, arcu est posuere velit, sed convallis ex orci sit amet lectus. Nam gravida quam ac nunc finibus,
                        non vehicula lacus efficitur. Morbi id magna ut lorem consequat vehicula.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* Terms of Service Section */}
            <Accordion expanded={expanded === 'terms'} onChange={handleChange('terms')} sx={{ marginBottom: '1rem', backgroundColor: '#393E46', color: 'white' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} id="terms">
                    <Typography variant="h5" component="div">Terms of Service</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1" component="p">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec quis ligula et erat eleifend vulputate a sit amet nulla. Nulla facilisi. Donec non est est. Fusce condimentum nisi at justo varius, quis elementum elit tincidunt.
                        Ut ac eros ultricies, scelerisque velit sit amet, auctor dolor. Nullam nec nunc nec nunc ultricies ultricies. Nullam nec nunc nec nunc ultricies ultricies. Nullam nec nunc nec nunc ultricies ultricies.
                    </Typography>
                    <Typography variant="body1" component="p">
                        Vivamus sollicitudin turpis neque, nec vulputate erat feugiat vel. Sed non gravida leo, vitae aliquam ex. Duis ac felis et lorem finibus malesuada. Nunc sit amet elit est. Phasellus vitae lacinia eros, nec venenatis metus. Aliquam sit amet vehicula leo.
                        Fusce quis lorem vel mauris placerat volutpat non sed ante. Nullam nec nunc nec nunc ultricies ultricies. Nullam nec nunc nec nunc ultricies ultricies.
                    </Typography>
                    <Typography variant="body1" component="p">
                        Suspendisse potenti. Nulla non odio eu ex facilisis facilisis. Quisque volutpat sollicitudin orci, a lacinia orci vestibulum in. Proin elementum leo sit amet eros vehicula, a dictum libero volutpat. Cras quis diam in erat gravida pharetra non sed odio.
                        Nullam nec nunc nec nunc ultricies ultricies. Nullam nec nunc nec nunc ultricies ultricies. Nullam nec nunc nec nunc ultricies ultricies.
                        Suspendisse potenti. Nulla non odio eu ex facilisis facilisis. Quisque volutpat sollicitudin orci, a lacinia orci vestibulum in. Proin elementum leo sit amet eros vehicula, a dictum libero volutpat. Cras quis diam in erat gravida pharetra non sed odio.
                    </Typography>
                </AccordionDetails>
            </Accordion>

            {/* FAQ Section */}
            <Accordion expanded={expanded === 'faq'} onChange={handleChange('faq')} sx={{ backgroundColor: '#393E46', color: 'white' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'white' }} />} id="faq">
                    <Typography variant="h5" component="div">Frequently Asked Questions (FAQs)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1" component="p">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id dictum quam, at ornare nulla. Integer id egestas magna. Nullam sit amet tortor at arcu varius aliquam.
                        Ut fringilla justo non orci euismod interdum. Fusce nec ante euismod, bibendum lectus ac, luctus mi.
                    </Typography>
                    <Typography variant="body1" component="p">
                        <strong>Q:</strong> Lorem ipsum dolor sit amet?<br />
                        <strong>A:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fermentum vel arcu nec aliquam. Nam ac nunc id magna pharetra fringilla nec vel augue.
                    </Typography>
                    <Typography variant="body1" component="p">
                        <strong>Q:</strong> Curabitur ac elit nec sem?<br />
                        <strong>A:</strong> Curabitur ac elit nec sem consectetur vehicula in a velit. Donec elementum, ligula in venenatis faucibus. Morbi vulputate quam id dolor sollicitudin lobortis. Duis fermentum ante ac mi facilisis convallis.
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Container>
    );
};

export default FAQInfoPage;
