//
//  LandingControl.swift
//  Trade Marketplace
//
//  Created by William larsen on 3/10/22.
//

import SwiftUI

enum Views: String {
    case login
    case signup
    case landing
}

struct LandingControl: View {
    @State var selectedbutton : Views = .landing
    var body: some View {
        ZStack {
            Group{
                switch selectedbutton {
                case .login:
                    LoginView(selectedbutton: $selectedbutton)
                case .signup:
                    SignupView(selectedbutton: $selectedbutton)
                case .landing:
                    LandingView(selectedbutton: $selectedbutton)
                
                }
            }
        }
    }
}

struct LandingControl_Previews: PreviewProvider {
    static var previews: some View {
        LandingControl()
   }
}
