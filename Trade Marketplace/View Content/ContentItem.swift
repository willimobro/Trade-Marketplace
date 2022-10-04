//
//  ContentItem.swift
//  Trade Marketplace
//
//  Created by William larsen on 21/09/22.
//

import SwiftUI

struct ContentItem: View {
    var body: some View {
        RoundedRectangle(cornerRadius: 30)
            .foregroundColor(.white)
            .shadow(color: .gray, radius: 4, x: 0, y: -4)
            .overlay(
                VStack{
                Text("Title")
                    .frame(width: 359, alignment: .leading)
                    .font(.custom("Poppins-SemiBold", size: 28))
                Text("Subtitle")
                    .frame(width: 359, alignment: .leading)
                    .font(.custom("Poppins-SemiBold", size: 14))
                    .foregroundColor(.gray)
                Text("# amount of quotes sent")
                    .frame(width: 359, height: 28, alignment: .topLeading)
                    .font(.custom("Poppins-SemiBold", size: 14))
                    .foregroundColor(.gray)
                QuoteNowButton()
                ScrollView(.vertical){
                VStack{
                Text("Details")
                    .frame(width: 359, alignment: .leading)
                    .font(.custom("Poppins-SemiBold", size: 24))
                Text("were and where")
                    .frame(width: 359, alignment: .leading)
                    .font(.custom("Poppins-SemiBold", size: 14))
                    .foregroundColor(.gray)
                Text("Need someone to check my wires have been trying to it to work and cant figure it out")
                    .frame(width: 359, alignment: .leading)
                    .font(.custom("Poppins-SemiBold", size: 16))
                        }
                    }
                
                ProfileSub()
                TagSub()
                }.edgesIgnoringSafeArea(.bottom)
                    .padding(.top, 20)
                
                
                
            )
        
    }
}

struct ContentItem_Previews: PreviewProvider {
    static var previews: some View {
        ContentItem()
    }
}
