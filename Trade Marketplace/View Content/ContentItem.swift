//
//  ContentItem.swift
//  Trade Marketplace
//
//  Created by William larsen on 21/09/22.
//

import SwiftUI

struct ContentItem: View {
    @Binding   var title: String
    @Binding   var subtitle: String
    @Binding   var quotesent: Int
    @Binding   var location: String
    @Binding  var description: String
    var body: some View {
        RoundedRectangle(cornerRadius: 30)
            .foregroundColor(.white)
            .shadow(color: .gray, radius: 4, x: 0, y: -4)
            .overlay(
                VStack{
                Text(title)
                    .frame(width: 359, alignment: .leading)
                    .font(.custom("Poppins-SemiBold", size: 28))
                Text(subtitle)
                    .frame(width: 359, alignment: .leading)
                    .font(.custom("Poppins-SemiBold", size: 14))
                    .foregroundColor(.gray)
                Text("\(quotesent)")
                    .frame(width: 359, height: 28, alignment: .topLeading)
                    .font(.custom("Poppins-SemiBold", size: 14))
                    .foregroundColor(.gray)
                QuoteNowButton()
                ScrollView(.vertical){
                VStack{
                Text("Details")
                    .frame(width: 359, alignment: .leading)
                    .font(.custom("Poppins-SemiBold", size: 24))
                Text(location)
                    .frame(width: 359, alignment: .leading)
                    .font(.custom("Poppins-SemiBold", size: 14))
                    .foregroundColor(.gray)
                Text(description)
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
//
//struct ContentItem_Previews: PreviewProvider {
//    static var previews: some View {
//        ContentItem()
//    }
//}
