package com.example.back.data.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class RunLocation {
    @Id
    @GeneratedValue
    private Long id;

    private double latitude;

    public RunLocation(double latitude, double longitude, Instant timeStamp, RunSession session) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.timeStamp = timeStamp;
        this.session = session;
    }

    private double longitude;
    private Instant timeStamp;

    @ManyToOne
    @JoinColumn(name = "session_id") //새 컬럼 만듦
    private RunSession session;

    public RunLocation(){}

    public RunLocation(double latitude, double longitude, Instant timeStamp) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.timeStamp = timeStamp;
    }

    public RunSession getSession() {
        return session;
    }

    public void setSession(RunSession session) {
        this.session = session;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public Instant getTimeStamp() {
        return timeStamp;
    }

    public void setTimeStamp(Instant timeStamp) {
        this.timeStamp = timeStamp;
    }
}
