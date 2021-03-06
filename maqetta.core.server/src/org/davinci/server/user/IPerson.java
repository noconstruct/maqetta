package org.davinci.server.user;

public interface IPerson {
    public String getEmail();
    
    /* first/last name for display purposes only */
    public String getFirstName();
    public String getLastName();
    
    /* user ID may be autogenerated or some other unique key */
    public String getUserID();
}
