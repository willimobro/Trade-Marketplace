//
//  AboutTradeMarketplace.swift
//  Trade Marketplace
//
//  Created by Matthew Larsen on 18/10/22.
//
//hello///
//2
import SwiftUI

struct AboutTradeMarketplace: View {
    var body: some View {
        VStack{
            LogoView()
                .frame(width: 77.34, height: 128.01)
                .foregroundColor(Color("logogreen"))


            

            
            Text("Trade Marketplace App")
                .fontWeight(.semibold)
                .multilineTextAlignment(.center)
                .padding([.top, .leading, .trailing])
            Text("Made in Invercargill, New Zealand")
                .multilineTextAlignment(.center)
                .padding(.bottom, 40.0)
            Text("DEV")
                .multilineTextAlignment(.center)
                .foregroundColor(.red)
            Text("Version 0.01")
                .multilineTextAlignment(.center)

        }
    }
}

struct AboutTradeMarketplace_Previews: PreviewProvider {
    static var previews: some View {
        AboutTradeMarketplace()
    }
}
