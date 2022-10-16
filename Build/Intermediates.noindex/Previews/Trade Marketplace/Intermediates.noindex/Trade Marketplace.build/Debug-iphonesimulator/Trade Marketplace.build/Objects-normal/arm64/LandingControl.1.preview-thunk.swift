@_private(sourceFile: "LandingControl.swift") import Trade_Marketplace
import SwiftUI
import SwiftUI

extension LandingControl_Previews {
    @_dynamicReplacement(for: previews) private static var __preview__previews: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/UserView/LandingControl.swift", line: 39)
        LandingControl()
   
#sourceLocation()
    }
}

extension LandingControl {
    @_dynamicReplacement(for: body) private var __preview__body: some View {
        #sourceLocation(file: "/Applications/Trade-Marketplace/Trade Marketplace/UserView/LandingControl.swift", line: 20)
        ZStack {
            Group{
                switch selectedbutton {
                case .login:
                    LoginView(selectedbutton: $selectedbutton)
                case .signup:
                    SignupView(selectedbutton: $selectedbutton)
                case .landing:
                    LandingView(selectedbutton: $selectedbutton)
                case.home:
                    TabBar()
                }
            }
        }
    
#sourceLocation()
    }
}

import enum Trade_Marketplace.Views
import struct Trade_Marketplace.LandingControl
import struct Trade_Marketplace.LandingControl_Previews
