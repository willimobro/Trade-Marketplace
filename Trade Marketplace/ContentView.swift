//
//  ContentView.swift
//  Trade Marketplace
//
//  Created by William larsen on 11/10/22.
//

import SwiftUI



struct ContentView: View {
    @EnvironmentObject var loggedin: UserLoggedIn
    var body: some View {
        if loggedin == 1 {
            TabBar()
        } else {
            LandingControl()
        }
    }
}

