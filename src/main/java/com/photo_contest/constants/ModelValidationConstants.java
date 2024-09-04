package com.photo_contest.constants;

public class ModelValidationConstants {


    public static final String INVALID_ID = "Invalid %s with ID: %d!";

    // User constants DD
    public static final String INVALID_USERNAME = "Invalid username: %s!";
    public static final String USERNAME_MANDATORY = "Username is mandatory";
    public static final String USERNAME_SIZE_MESSAGE = "Username must be at least 4 characters long";
    public static final String PASSWORD_MANDATORY = "Password is mandatory";
    public static final String PASSWORD_SIZE_MESSAGE = "Password must be at least 6 characters long";
    public static final String EMAIL_MANDATORY = "Email is mandatory";
    public static final String EMAIL_VALIDATION_MESSAGE = "Email should be valid";


    // constants for user profile DD

    public static final String FIRST_NAME_SIZE_MSG = "First name cannot be longer than 26 characters";
    public static final String LAST_NAME_SIZE_MSG = "Last name cannot be longer than 26 characters";
    public static final int NAME_MAX_SIZE = 26;

    // Validation and Default Value Constants for PhotoReview (PR)
    public static final String PR_SCR_MIN_MSG = "Score must be at least 1";
    public static final String PR_SCR_MAX_MSG = "Score must be at most 10";
    public static final String PR_COMMENT_MANDATORY_MSG = "Comment is mandatory";
    public static final String PR_COMMENT_SIZE_MSG = "Comment must be less than 5000 characters";
    public static final int PR_DEFAULT_SCR = 3;
    public static final int PR_COMMENT_MAX_SIZE = 5000;

    // Validation and Default Value Constants for PhotoSubmission (PS)
    public static final String PS_TITLE_MANDATORY_MSG = "Title is mandatory";
    public static final String PS_TITLE_SIZE_MSG = "Title must be less than 255 characters";
    public static final String PS_STORY_MANDATORY_MSG = "Story is mandatory";
    public static final String PS_STORY_SIZE_MSG = "Story must be less than 5000 characters";
    public static final String PS_PHOTO_URL_MANDATORY_MSG = "Photo URL is mandatory";
    public static final int PS_TITLE_MAX_SIZE = 255;
    public static final int PS_STORY_MAX_SIZE = 5000;


    // Contest-related constants
    public static final String TITLE_REQUIRED = "Title is required.";
    public static final String TITLE_SIZE = "Title must be between 6 and 26 characters.";
    public static final String CATEGORY_REQUIRED = "Category is required.";
    public static final String PHASE_DURATION_MIN = "Phase duration must be at least 1 day.";
    public static final String PHASE_DURATION_MAX = "Phase duration cannot exceed 30 days.";
    public static final String PHASE_TWO_DURATION_MIN = "Phase 2 duration must be at least 1 hour.";
    public static final String PHASE_TWO_DURATION_MAX = "Phase 2 duration cannot exceed 24 hours.";
    public static final String PHASE_WITH_ID_NOT_FOUND = "Phase with ID %d not found";
    public static final String PH_TWO_REVIEW = "Reviews can only be made during Phase Two.";
    public static final String USER_NOT_JURY = "User needs to be part of the contest jury to make reviews";
    public static final String USER_IS_ALREADY_A_PARTICIPANT = "User is already a participant";
    public static final String PRIVATE_CONTEST = "Cannot join a private contest";
    public static final String CONTEST_EXISTS = "Contest with this title already exists";
    public static final String NOT_ORGANIZER = "Only the organizer can invite %s";
    public static final String INVALID_SUBMISSION = "User needs to be part of the contest participants to make submissions";
    public static final String PH_ONE_SUBMISSION = "Submissions can only be made during Phase One.";
    public static final String PARTICIPANTS_INVITED_SUCCESSFULLY = "Participants invited successfully";
    public static final String PARTICIPANTS_FAILED_INVITES = "Participants invited, but failed to invite the following users: ";
    public static final String PARTICIPANTS_INVITE_FAILED = "Failed to invite participants: ";
    public static final String JUDGES_INVITED_SUCCESSFULLY = "Judges invited successfully";
    public static final String JUDGES_FAILED_INVITES = "Judges invited, but failed to invite the following users: ";
    public static final String JUDGES_INVITE_FAILED = "Failed to invite judges: ";


}
