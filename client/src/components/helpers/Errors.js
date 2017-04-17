import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
    width: 100%;
    display: ${props => props.error ? 'flex' : 'none'};
    background-color: #e6e6e6;
    color: #da3a3a;
`;

const Errors = ({ error }) => {
    const errorHTML = [];
    Object.keys(error).forEach(name => {
        errorHTML.push(<li key={`${name}_error`}>{error[name]}</li>);
    });
    return (
        <ErrorContainer error={error}>
            <ul>
                {errorHTML}
            </ul>
        </ErrorContainer>
    );
};

export default Errors;
